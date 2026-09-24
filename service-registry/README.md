# DentalCancun Service Registry & Ad Lineage System

Canonical map of **what the clinic sells** -> **what marketing collateral exists** ->
**which ads carry it** -> **when that creative must be refreshed**.

Built 2026-09-24. Source of truth for SKUs: `client_provided_documents/price_list` (April 2026).

## Why this exists
Marketing collateral had drifted from the actual service menu. The clinic sells 39 services;
the website markets roughly four of them. This registry makes that drift measurable and keeps
every revenue-bearing service on a continuous lineage of creative.

## Files
| File | Purpose |
|---|---|
| `registry.json` | The registry: 39 SKUs, 16 treatment cases, 4 campaign clusters, lineage rules |
| `build_registry.py` | Builds per-SKU records + campaign tiers from the price list |
| `build_cases.py` | Case-level economics (what a patient actually buys, not per-unit list price) |
| `build_audiences.py` | Intent audience clusters + lineage/refresh policy |
| `meta_ad_audit.py` | Pulls every ad from the Meta account and stages creatives for visual analysis |

## Campaign tiers
Tier is set by **net savings to a US patient after ~$900 of travel cost**, because that is the
only number that decides whether flying to Cancun is rational.

- **Tier 1 (>= $5,000 net)** — anchors US acquisition. Refresh creative every **30 days**.
- **Tier 2 ($1,500-$4,999)** — supporting, bundle or retarget. Refresh every **60 days**.
- **Tier 3 (< $1,500)** — not travel-viable. Local and retention only, never US prospecting.
  Refresh every **120 days**.

## Ad lineage
Every cluster carries an unbroken chain of creative. Each ad records its `generation` and
`parent_ad_id`, so the lineage of a cluster is auditable over time and no cluster silently
goes dark. Health states: `current`, `stale`, `dark`, `no-creative`.

## Running the audit
```bash
set -a; source ~/repos/arkdata/infra/functions/.env; set +a
python3 meta_ad_audit.py --account act_<DENTALCANCUN_ID> --out ./audit
```
Read-only. It never creates, edits, pauses, or spends.

## Known gaps
1. **No Meta access.** ArkData BM `1821437278968539` cannot see a DentalCancun ad account,
   so every `ad_lineage` array is empty and no ad has been audited. Partner access with
   `ads_read` unblocks this.
2. **Aesthetics SKUs missing.** New aesthetics services are not in the April price list.
   The registry is incomplete until they are added.
3. **US benchmark prices are estimates** from published national averages, used only to rank
   travel-viability. Replace with client-verified competitive data when available.
