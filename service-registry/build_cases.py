#!/usr/bin/env python3
"""Case-level economics: what a US patient actually buys, not per-unit list price."""
import json
reg = json.load(open("registry.json"))
by = {s["sku_id"]: s for s in reg["services"]}
TRAVEL = reg["travel_cost_assumption_usd"]

# (case_id, label, [(sku, qty)], typical_us_case_low, typical_us_case_high)
CASES = [
 ("case-veneer-8-porc","8-Tooth Porcelain Veneer Case",[("ven-porc",8)],8*900,8*2500),
 ("case-veneer-10-emax","10-Tooth E-max/Zirconia Veneer Case",[("ven-emax",10)],10*1000,10*2500),
 ("case-veneer-6-comp","6-Tooth Composite Veneer Case (entry)",[("ven-comp-cer",6)],6*500,6*1600),
 ("case-makeover","Smile Makeover (~20 teeth)",[("pkg-makeover",1)],20000,50000),
 ("case-aof-single","All-on-4, Single Arch",[("imp-aof",1)],20000,30000),
 ("case-aof-double","All-on-4, Both Arches (full mouth)",[("imp-aof",2)],40000,60000),
 ("case-snap","Snap-on Denture, 4 Implants (per arch)",[("imp-snap",1)],10000,20000),
 ("case-overdenture","2-Implant Overdenture (lower)",[("imp-ball",1)],6000,12000),
 ("case-implant-single","Single Implant + Crown",[("imp-single",1)],3000,6000),
 ("case-implant-3","3 Single Implants",[("imp-single",3)],9000,18000),
 ("case-implant-graft","Implant + Bone Graft + Sinus Lift",[("imp-single",1),("sur-graft",1),("sur-sinus",1)],5500,10000),
 ("case-bridge-3","3-Unit Fixed Bridge",[("crn-bridge",3)],3000,7500),
 ("case-crowns-4","4 Zirconia Crowns",[("crn-bruxzir",4)],4800,11200),
 ("case-rct-crown","Root Canal + Crown (per tooth)",[("end-cracked",1)],2000,4000),
 ("case-fullmouth-srp","Full-Mouth Deep Cleaning (4 quadrants)",[("hyg-deep",4)],600,1600),
 ("case-whitening","In-Office Whitening (standalone)",[("cos-whitening",1)],300,1000),
]

def tier(net):
    if net >= 5000: return 1,"Anchor - lead US acquisition"
    if net >= 1500: return 2,"Supporting - bundle or retarget"
    return 3,"Local / retention only - not travel-viable"

rows=[]
for cid,label,items,ul,uh in CASES:
    our = sum(by[s]["price_usd"]*q for s,q in items)
    us_mid=(ul+uh)/2
    net = us_mid - our - TRAVEL
    t,tl = tier(net)
    pages=sorted({p for s,_ in items for p in by[s]["collateral_pages"]})
    rows.append({"case_id":cid,"label":label,
      "components":[{"sku":s,"qty":q,"name":by[s]["name"]} for s,q in items],
      "our_price_usd":our,"us_case_midpoint_usd":us_mid,
      "net_savings_after_travel_usd":round(net),
      "savings_pct":round((us_mid-our)/us_mid*100),
      "campaign_tier":t,"tier_label":tl,
      "collateral_pages":pages,"has_collateral":bool(pages),
      "creative_refresh_days":{1:30,2:60,3:120}[t],
      "ad_lineage":[]})

rows.sort(key=lambda r:-r["net_savings_after_travel_usd"])
reg["cases"]=rows
json.dump(reg,open("registry.json","w"),indent=2)

print(f"{'CASE':<42}{'OURS':>8}{'US MID':>9}{'NET SAVE':>10}{'%':>5}  T  COLLATERAL")
print("-"*95)
for r in rows:
    print(f"{r['label']:<42}{r['our_price_usd']:>8,}{int(r['us_case_midpoint_usd']):>9,}"
          f"{r['net_savings_after_travel_usd']:>10,}{r['savings_pct']:>4}%  {r['campaign_tier']}  "
          f"{'yes' if r['has_collateral'] else 'NONE'}")
