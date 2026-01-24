import json
from pathlib import Path

TARGETS = {
    "3hydroxy2methylbutyric": {
        "cas": "473-86-9",
        "smiles": "CC(O)C(C)C(=O)O",
        "structureImagePath": "/structures/3hydroxy2methylbutyric.png",
        "synonyms": [
            "2-Methyl-3-hydroxybutyric acid",
            "3-Hydroxy-2-methylbutanoic acid",
            "3-Hydroxy-2-methylbutanoate",
            "HMBA",
            "3-Hydroxy-2-methylbutyric acid",
        ],
    },
    "3hydroxy3methylglutaric": {
        "cas": "503-49-1",
        "smiles": "CC(CC(=O)O)(CC(=O)O)O",
        "structureImagePath": "/structures/3hydroxy3methylglutaric.png",
        "synonyms": [
            "3-Hydroxy-3-methylpentanedioic acid",
            "Meglutol",
            "3-Hydroxy-3-methylglutarate",
            "Dicrotalic acid",
            "HMG acid",
        ],
    },
    "3hydroxybutyric": {
        # FIX: replace incorrect CAS 26063-00-3 with the commonly used DL form CAS
        "cas": "300-85-6",
        "smiles": "CC(CC(=O)O)O",
        "structureImagePath": "/structures/3hydroxybutyric.png",
        "synonyms": [
            "β-Hydroxybutyric acid",
            "β-Hydroxybutyrate",
            "BHB",
            "DL-β-hydroxybutyric acid",
            "(±)-3-Hydroxybutanoic acid",
        ],
    },
    "3hydroxyisobutyric": {
        "cas": "2068-83-9",
        "smiles": "O=C(O)C(C)CO",
        "structureImagePath": "/structures/3hydroxyisobutyric.png",
        "synonyms": [
            "3-Hydroxyisobutyrate",
            "β-Hydroxyisobutyric acid",
            "3-HIBA",
            "3-Hydroxy-2-methylpropionic acid",
            "3-Hydroxy-2-methylpropanoic acid",
        ],
    },
    "3hydroxyisovaleric": {
        # FIX: replace incorrect CAS 123743-99-7 with CAS 625-08-1 for 3-hydroxyisovaleric acid
        "cas": "625-08-1",
        "smiles": "CC(C)(O)CC(=O)O",
        "structureImagePath": "/structures/3hydroxyisovaleric.png",
        "synonyms": [
            "β-Hydroxyisovaleric acid",
            "3-Hydroxy-3-methylbutyric acid",
            "3-HIV",
            "HMB (free acid)",
            "3-hydroxyisovalerate",
        ],
    },
}


def find_analytes_json() -> Path:
    for path in Path(".").rglob("analytes.json"):
        return path
    raise FileNotFoundError("Could not find analytes.json")


def main() -> None:
    path = find_analytes_json()
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, list):
        raise ValueError("Expected analytes.json to be a JSON array")

    updated = 0
    for analyte in data:
        analyte_id = analyte.get("id")
        if analyte_id in TARGETS:
            patch = TARGETS[analyte_id]
            analyte["cas"] = patch["cas"]
            analyte["smiles"] = patch["smiles"]
            analyte["structureImagePath"] = patch["structureImagePath"]
            analyte["synonyms"] = patch["synonyms"]
            updated += 1

    if updated != len(TARGETS):
        missing = set(TARGETS.keys()) - {a.get("id") for a in data}
        raise RuntimeError(
            f"Did not update all targets. Missing in file: {sorted(missing)}"
        )

    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    print(f"Updated {updated} analytes in {path}")


if __name__ == "__main__":
    main()
