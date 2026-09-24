#!/usr/bin/env python3
"""
DentalCancun Meta ad audit. Pulls every ad in the account, downloads each creative,
and stages them for visual analysis -> SKU mapping -> US-campaign readiness verdict.

Usage:
  python3 meta_ad_audit.py --account act_XXXXXXXXX [--since 2026-01-01] [--out ./audit]

Requires META_SYSTEM_USER_TOKEN (or META_ACCESS_TOKEN) with ads_read on the account.
Runs read-only. It never creates, edits, pauses or spends.
"""
import os, sys, json, argparse, urllib.request, urllib.parse, pathlib, time

V = "v21.0"
BASE = f"https://graph.facebook.com/{V}"

def token():
    for k in ("META_SYSTEM_USER_TOKEN", "META_ACCESS_TOKEN"):
        if os.environ.get(k): return os.environ[k]
    sys.exit("ERROR: no META_SYSTEM_USER_TOKEN / META_ACCESS_TOKEN in env")

def get(path, params, tok):
    params = dict(params); params["access_token"] = tok
    url = f"{BASE}/{path}?" + urllib.parse.urlencode(params)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(url, timeout=45) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:400]
            if e.code in (429, 500, 503) and attempt < 3:
                time.sleep(2 ** attempt * 5); continue
            print(f"  ! HTTP {e.code} on {path}: {body}", file=sys.stderr)
            return {"data": [], "error": body}
        except Exception as e:
            if attempt < 3: time.sleep(3); continue
            print(f"  ! {e}", file=sys.stderr); return {"data": []}
    return {"data": []}

def paged(path, params, tok, cap=2000):
    out, after = [], None
    while len(out) < cap:
        p = dict(params, limit=100)
        if after: p["after"] = after
        d = get(path, p, tok)
        out.extend(d.get("data", []))
        after = (d.get("paging", {}).get("cursors", {}) or {}).get("after")
        if not after or not d.get("data"): break
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--account", required=True)
    ap.add_argument("--since", default="2025-01-01")
    ap.add_argument("--until", default=time.strftime("%Y-%m-%d"))
    ap.add_argument("--out", default="./audit")
    a = ap.parse_args()
    tok = token()
    acct = a.account if a.account.startswith("act_") else "act_" + a.account
    out = pathlib.Path(a.out); (out / "creatives").mkdir(parents=True, exist_ok=True)

    # 0. Confirm access before doing anything else.
    me = get(acct, {"fields": "id,name,account_status,currency,timezone_name"}, tok)
    if "error" in me or not me.get("id"):
        sys.exit(f"ERROR: cannot read {acct}. Grant ArkData (BM 1821437278968539) "
                 f"partner access with ads_read, then re-run.\n{me.get('error','')}")
    print(f"Account: {me.get('name')} ({me['id']})  status={me.get('account_status')} {me.get('currency')}")

    print("Fetching campaigns / ad sets / ads ...")
    campaigns = paged(f"{acct}/campaigns", {"fields":
        "id,name,objective,status,effective_status,created_time,stop_time,special_ad_categories"}, tok)
    adsets = paged(f"{acct}/adsets", {"fields":
        "id,name,campaign_id,status,effective_status,daily_budget,lifetime_budget,"
        "optimization_goal,billing_event,targeting,start_time,end_time"}, tok)
    ads = paged(f"{acct}/ads", {"fields":
        "id,name,adset_id,campaign_id,status,effective_status,created_time,updated_time,"
        "creative{id,name,title,body,image_url,thumbnail_url,video_id,object_story_spec,"
        "asset_feed_spec,call_to_action_type,effective_object_story_id}"}, tok)
    print(f"  {len(campaigns)} campaigns, {len(adsets)} ad sets, {len(ads)} ads")

    # Lifetime insights per ad, so a verdict can weigh spend and engagement.
    print("Fetching per-ad insights ...")
    ins = {}
    for i, ad in enumerate(ads, 1):
        d = get(f"{ad['id']}/insights", {"fields":
            "spend,impressions,reach,clicks,ctr,cpm,frequency,actions,cost_per_action_type,"
            "video_p25_watched_actions,video_p100_watched_actions,"
            "video_thruplay_watched_actions,quality_ranking,engagement_rate_ranking",
            "time_range": json.dumps({"since": a.since, "until": a.until})}, tok)
        rows = d.get("data") or []
        ins[ad["id"]] = rows[0] if rows else {}
        if i % 25 == 0: print(f"  {i}/{len(ads)}")

    # Download every still creative for visual analysis.
    print("Downloading creatives ...")
    manifest, got = [], 0
    for ad in ads:
        cr = ad.get("creative") or {}
        url = cr.get("image_url") or cr.get("thumbnail_url")
        vid = cr.get("video_id")
        fn = None
        if url:
            fn = out / "creatives" / f"{ad['id']}.jpg"
            if not fn.exists():
                try:
                    urllib.request.urlretrieve(url, fn); got += 1
                except Exception as e:
                    print(f"  ! creative dl failed {ad['id']}: {e}", file=sys.stderr); fn = None
        m = ins.get(ad["id"], {})
        manifest.append({
            "ad_id": ad["id"], "ad_name": ad.get("name"),
            "campaign_id": ad.get("campaign_id"), "adset_id": ad.get("adset_id"),
            "status": ad.get("effective_status"), "created": ad.get("created_time"),
            "creative_id": cr.get("id"),
            "format": "video" if vid else ("image" if url else "unknown"),
            "video_id": vid,
            "headline": cr.get("title"), "body": cr.get("body"),
            "cta": cr.get("call_to_action_type"),
            "local_image": str(fn) if fn else None,
            "spend": m.get("spend"), "impressions": m.get("impressions"),
            "reach": m.get("reach"), "ctr": m.get("ctr"), "cpm": m.get("cpm"),
            "quality_ranking": m.get("quality_ranking"),
            # filled by the visual-analysis pass:
            "visual_subject": None, "mapped_sku": None, "mapped_cluster": None,
            "us_ready_verdict": None, "verdict_reason": None,
        })
    print(f"  downloaded {got} images")

    json.dump({"account": me, "campaigns": campaigns, "adsets": adsets,
               "ads": manifest, "pulled_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())},
              open(out / "raw_audit.json", "w"), indent=2)
    print(f"\nWrote {out}/raw_audit.json  ({len(manifest)} ads)")
    print(f"Next: visually analyse {out}/creatives/*.jpg and fill visual_subject / mapped_sku / verdict.")

if __name__ == "__main__":
    main()
