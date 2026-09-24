#!/usr/bin/env python3
"""Intent audience definitions per campaign cluster + ad lineage tracking rules."""
import json
reg=json.load(open("registry.json"))

CLUSTERS = [
 {"cluster_id":"cl-fullarch","label":"Full-Arch Restoration (All-on-4 / Snap-on / Overdenture)",
  "cases":["case-aof-double","case-aof-single","case-snap","case-overdenture"],
  "tier":1,
  "patient":"55-75, failing or already-missing dentition, currently in or facing full dentures. Often has been quoted $25k-50k domestically and declined.",
  "intent_signals":["all on 4 cost","full mouth dental implants price","dentures vs implants",
     "teeth in a day","dental implant financing denied","affordable full mouth reconstruction",
     "dental tourism mexico implants","cancun dental implants"],
  "audience_build":"Intent seed on full-arch implant + denture-replacement terms; layer US homeowners 55-75 with disposable income; exclude existing patients.",
  "geo":"US nationwide, weight TX/FL/CA/AZ/IL (direct CUN flights + large 55+ population)",
  "creative_need":"Before/after full-arch cases, Dr. Carolina on-camera credibility, cost-comparison card, travel logistics reassurance.",
  "refresh_days":30},
 {"cluster_id":"cl-cosmetic","label":"Cosmetic Smile (Veneers / Smile Makeover)",
  "cases":["case-makeover","case-veneer-10-emax","case-veneer-8-porc","case-veneer-6-comp"],
  "tier":1,
  "patient":"28-50, appearance-driven, social/professional trigger (wedding, promotion, divorce, on-camera work). Price-aware but aspiration-led.",
  "intent_signals":["veneers cost","how much are porcelain veneers","no prep veneers",
     "smile makeover","hollywood smile","composite vs porcelain veneers",
     "veneers turkey vs mexico","dental veneers abroad"],
  "audience_build":"Intent seed on veneer/smile-makeover terms; layer beauty + aesthetics affinity, recent engagement/wedding signals, creator-economy occupations.",
  "geo":"US nationwide, weight metro CA/NY/TX/FL/GA",
  "creative_need":"Close-up before/after, no-drilling differentiator, trial-smile footage, patient testimonial video.",
  "refresh_days":30},
 {"cluster_id":"cl-implant-single","label":"Single & Multi-Tooth Implants",
  "cases":["case-implant-3","case-implant-single","case-implant-graft","case-bridge-3","case-crowns-4"],
  "tier":2,
  "patient":"40-65, one or several failing/missing teeth, already treatment-planned by a US dentist and shopping the quote.",
  "intent_signals":["dental implant cost per tooth","bone graft cost","sinus lift price",
     "dental bridge vs implant","second opinion dental quote","zirconia crown cost"],
  "audience_build":"Intent seed on implant + crown/bridge terms; retarget site visitors who hit /implants; lookalike off full-arch converters.",
  "geo":"US nationwide, weight direct-flight metros",
  "creative_need":"Single-case story arc, quote-comparison creative, 'bring your treatment plan' offer.",
  "refresh_days":60},
 {"cluster_id":"cl-retention","label":"Retention / Local (non-travel-viable)",
  "cases":["case-rct-crown","case-whitening","case-fullmouth-srp"],
  "tier":3,
  "patient":"Existing patients, local Cancun residents, and expats already in-market.",
  "intent_signals":["dentist near me cancun","teeth cleaning cancun","emergency dentist cancun"],
  "audience_build":"Do NOT run US prospecting. Local geo + existing-patient CRM retargeting only.",
  "geo":"Cancun / Riviera Maya + expat communities",
  "creative_need":"Low-production, offer-led, organic-style.",
  "refresh_days":120},
]

reg["clusters"]=CLUSTERS
reg["lineage_rules"]={
  "principle":"Every SKU cluster carries a continuous lineage of creative. A cluster is never left without a live, in-date ad.",
  "refresh_policy":{
    "tier_1_days":30,"tier_2_days":60,"tier_3_days":120,
    "rationale":"Refresh cadence tracks spend concentration and audience overlap. Tier 1 carries the budget, so it fatigues first."},
  "lineage_record_schema":{
    "ad_id":"Meta ad id","creative_id":"Meta creative id","generation":"int, 1 = first ad ever for this cluster",
    "parent_ad_id":"ad this iterated from, null for gen 1","launched":"ISO date","retired":"ISO date or null",
    "format":"image | video | carousel","hook":"first-3-second or headline hook",
    "visual_subject":"what the image/video actually shows, from creative analysis",
    "mapped_sku":"sku_id this creative sells","verdict":"ready | needs-rework | wrong-market | retire"},
  "health_states":{
    "current":"live ad younger than the cluster refresh window",
    "stale":"live ad older than the refresh window - queue a successor",
    "dark":"cluster has zero live ads - revenue exposure",
    "no-creative":"cluster has never had an ad"},
}
json.dump(reg,open("registry.json","w"),indent=2)

print("CLUSTER COVERAGE\n"+"-"*78)
cases={c["case_id"]:c for c in reg["cases"]}
for cl in CLUSTERS:
    val=sum(cases[c]["net_savings_after_travel_usd"] for c in cl["cases"] if c in cases)
    cov=[c for c in cl["cases"] if cases.get(c,{}).get("has_collateral")]
    print(f"[T{cl['tier']}] {cl['label']}")
    print(f"      cases:{len(cl['cases'])}  collateral on {len(cov)}/{len(cl['cases'])}  "
          f"refresh every {cl['refresh_days']}d  lineage: NONE (no ad access)")
