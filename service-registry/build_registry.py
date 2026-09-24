#!/usr/bin/env python3
"""Build the DentalCancun canonical service registry (SKU -> collateral -> ad lineage)."""
import json, datetime

# US benchmark ranges are ESTIMATES from published national averages, used only
# to rank travel-viability. They are not client-supplied figures.
S = [
 # id, name, price, category, us_low, us_high, qty_note
 ("hyg-cleaning","Dental Cleaning / Prophylaxis",120,"Preventive",75,200,None),
 ("hyg-deep","Deep Cleaning / SRP (per quadrant)",250,"Preventive",150,400,"x4 quadrants typical"),
 ("hyg-perio","Periodontal Maintenance",250,"Preventive",150,350,None),
 ("hyg-debride","Full Mouth Debridement",150,"Preventive",150,350,None),
 ("ven-comp-std","Composite Veneer (direct, standard)",250,"Veneers",400,1500,"per tooth"),
 ("ven-comp-cer","Composite Veneer (ceramic finish)",328,"Veneers",500,1600,"per tooth"),
 ("ven-porc","Porcelain Veneer (indirect)",450,"Veneers",900,2500,"per tooth"),
 ("ven-emax","Lab Veneer E-max / Zirconia 3D",490,"Veneers",1000,2500,"per tooth"),
 ("ven-empress","Empress Esthetic Veneer",450,"Veneers",900,2300,"per tooth"),
 ("cos-bonding","Cosmetic Bonding",250,"Cosmetic",300,900,"per tooth"),
 ("cos-contour","Cosmetic Contouring",250,"Cosmetic",200,800,"per tooth"),
 ("cos-whitening","In-Office Whitening",300,"Cosmetic",300,1000,None),
 ("pkg-makeover","Smile Makeover (~20 teeth)",9397,"Full-Arch Cosmetic",20000,50000,"hero SKU"),
 ("crn-porc","Porcelain / Zirconia Crown",465,"Crowns & Bridges",1000,2500,"per unit"),
 ("crn-bruxzir","Zirconia Crown / BruxZir",679,"Crowns & Bridges",1200,2800,"per unit"),
 ("crn-emax","E-Max / Empress Crown",679,"Crowns & Bridges",1200,2800,"per unit"),
 ("crn-pfm","PFM Crown",450,"Crowns & Bridges",800,1500,"per unit"),
 ("crn-bridge","Fixed Bridge (per unit)",700,"Crowns & Bridges",1000,2500,"3-unit typical"),
 ("crn-post","Post & Core Build-Up",150,"Crowns & Bridges",250,600,None),
 ("end-cracked","Cracked Tooth (root canal + crown)",900,"Endodontics",2000,4000,None),
 ("end-ant","Root Canal - Anterior/Premolar",300,"Endodontics",700,1100,None),
 ("end-molar","Root Canal - Molar",550,"Endodontics",1000,1800,None),
 ("end-std","Root Canal Therapy (standard)",350,"Endodontics",800,1400,None),
 ("end-retx","Root Canal Retreatment",400,"Endodontics",900,1600,None),
 ("imp-single","Single Dental Implant (+crown/abutment)",1744,"Implants",3000,6000,"per tooth"),
 ("imp-aof","All-on-4 (per arch)",12500,"Implants",20000,30000,"hero SKU"),
 ("imp-ball","Ball Attachment Denture (2-implant overdenture)",3500,"Implants",6000,12000,"per arch"),
 ("imp-snap","Snap-on Denture w/ 4 Implants",5300,"Implants",10000,20000,"per arch"),
 ("sur-ext","Tooth Extraction - Simple",75,"Oral Surgery",150,350,None),
 ("sur-surg","Extraction - Surgical / Wisdom",350,"Oral Surgery",250,600,None),
 ("sur-graft","Bone Graft (small area)",737,"Oral Surgery",600,1200,None),
 ("sur-sinus","Sinus Lift (per side)",1300,"Oral Surgery",1500,3000,None),
 ("sur-lengthen","Crown Lengthening",250,"Oral Surgery",1000,3000,"per tooth"),
 ("den-complete","Removable Complete Denture",801,"Dentures",1500,3000,"per arch"),
 ("den-premium","Premium Complete Acrylic Denture",1573,"Dentures",2000,4000,"per arch"),
 ("den-immediate","Immediate / Temporary Denture",600,"Dentures",1000,2000,None),
 ("den-repair","Denture Repair / Reline",200,"Dentures",300,800,None),
 ("adj-nightguard","Night Guard for Bruxism / TMD",100,"Adjunct",300,800,None),
 ("adj-sedation","IV Sedation (per session)",98,"Adjunct",500,1000,None),
]

# Live marketing collateral on www.dentalcancun.com, mapped to the SKUs each page sells.
COLLATERAL = {
 "ven-porc":["/veneers","/lp/porcelain-veneers","/lp/smile-design"],
 "ven-emax":["/veneers","/lp/smile-design"],
 "ven-comp-std":["/lp/no-prep-veneers"],
 "ven-comp-cer":["/lp/no-prep-veneers"],
 "ven-empress":["/veneers"],
 "pkg-makeover":["/smile-makeover","/lp/smile-design","/lp/vip-experience","/vip"],
 "imp-single":["/implants"],
}

TRAVEL_COST = 900  # round-trip flight + lodging allowance for a US patient, USD

def tier(savings):
    if savings >= 5000:  return 1, "Anchor - lead US acquisition"
    if savings >= 1500:  return 2, "Supporting - bundle or retarget"
    return 3, "Local / retention only - not travel-viable"

# Refresh cadence: higher-spend anchors burn creative faster.
CADENCE = {1:30, 2:60, 3:120}

out = []
for sid,name,price,cat,ul,uh,note in S:
    us_mid = (ul+uh)/2
    savings = us_mid - price
    net = savings - TRAVEL_COST
    t, label = tier(net)
    out.append({
        "sku_id": sid, "name": name, "category": cat,
        "price_usd": price,
        "us_benchmark_usd": {"low": ul, "high": uh, "midpoint": us_mid, "basis": "estimated US national average"},
        "gross_savings_usd": round(savings),
        "net_savings_after_travel_usd": round(net),
        "campaign_tier": t, "tier_label": label,
        "qty_note": note,
        "collateral_pages": COLLATERAL.get(sid, []),
        "has_collateral": bool(COLLATERAL.get(sid)),
        "creative_refresh_days": CADENCE[t],
        "ad_lineage": [],           # populated by meta_ad_audit.py once access is granted
        "last_creative_refresh": None,
        "refresh_status": "no-creative",
    })

reg = {
  "client": "dentalcancun",
  "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
  "source_price_list": "client_provided_documents/price_list (April 2026)",
  "travel_cost_assumption_usd": TRAVEL_COST,
  "aesthetics_skus_pending": True,
  "notes": "Aesthetics SKUs referenced by Shaw 2026-09-24 are NOT in the April price list and must be added before this registry is complete.",
  "services": out,
}
json.dump(reg, open("registry.json","w"), indent=2)
print(f"wrote registry.json with {len(out)} SKUs")
for t in (1,2,3):
    g=[s for s in out if s['campaign_tier']==t]
    cov=sum(1 for s in g if s['has_collateral'])
    print(f"  Tier {t}: {len(g)} SKUs, {cov} with collateral, {len(g)-cov} with NONE")
