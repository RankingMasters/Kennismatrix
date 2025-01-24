/*
  # Enhance levels table with detailed information

  1. Changes
    - Add new columns to levels table for detailed information:
      - description_extended (text): Extended description in Dutch
      - process (jsonb): Application process steps
      - time_investment (jsonb): Time investment details
      - learning_materials (jsonb): Study materials and resources
      - assessment (jsonb): Assessment criteria and process
      - rewards_extended (jsonb): Detailed rewards information
*/

-- Add new columns to levels table
ALTER TABLE levels ADD COLUMN IF NOT EXISTS description_extended text;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS process jsonb DEFAULT '[]'::jsonb;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS time_investment jsonb DEFAULT '{}'::jsonb;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS learning_materials jsonb DEFAULT '{}'::jsonb;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS assessment jsonb DEFAULT '{}'::jsonb;
ALTER TABLE levels ADD COLUMN IF NOT EXISTS rewards_extended jsonb DEFAULT '{}'::jsonb;

-- Update the Junior UX/UI Designer level with the new content
DO $$ 
DECLARE 
  description_text text := 'Als Junior UI/UX Designer ben je in staat om eenvoudige websites en user interfaces te ontwerpen die aantrekkelijk en gebruiksvriendelijk zijn. Je hebt een basisbegrip van designprincipes zoals consistentie, eenvoud en visuele hiërarchie, en je kunt deze toepassen om gebruikerservaringen te verbeteren. Daarnaast begrijp je de basis van HTML en CSS en kun je eenvoudige interactieve elementen zoals knoppen en navigatie ontwerpen. 

Je werkt zelfstandig aan kleinere projecten en ontwikkelt je vaardigheden in wireframing, visueel ontwerpen en prototyping. Hoewel je nog begeleiding nodig hebt bij complexere vraagstukken, leg je een sterke basis voor verdere groei als UX/UI Designer.';

  process_json jsonb := '[
    "Contacteer Kai of de manager om het leerproces te starten",
    "Bespreek de gekozen opdracht, leerdoelen en planning",
    "Maak duidelijke afspraken over deadlines en toetsmoment"
  ]';

  time_investment_json jsonb := '{
    "breakdown": {
      "zelfstudie": "10-20 uur",
      "wireframe_design": "6-8 uur",
      "prototype": "4-6 uur",
      "presentatie": "30-60 minuten",
      "evaluatie": "30-60 minuten"
    },
    "totals": {
      "uitvoerder": {
        "total": "20-35 uur",
        "details": {
          "leren": "20 uur",
          "uitvoerend": "14 uur",
          "meetings": "2 uur"
        }
      },
      "manager": {
        "total": "3 uur",
        "details": {
          "beoordeling": "1 uur",
          "meetings": "2 uur"
        }
      }
    }
  }';

  learning_materials_json jsonb := '{
    "technieken": [
      "Basisprincipes van UX: gebruiksvriendelijkheid, consistentie en eenvoud",
      "Design grids en lay-outprincipes: gebruik van marges, witruimte en visuele hiërarchie",
      "Toepassing van kleurpsychologie en typografie in UI-design",
      "Basis interacties: hover states, knoppenfunctionaliteit en eenvoudige navigatie"
    ],
    "tools": [
      "Figma: voor wireframing, visuele ontwerpen en eenvoudige prototypes",
      "Canva/Adobe suite: voor het maken van ondersteunende visuals",
      "Usability Heuristics Checklist: voor controle van ontwerpprincipes"
    ],
    "courses": [
      {
        "title": "Frontend UI designer full Figma course",
        "type": "Premium course",
        "note": "al gekocht, bekijk tot de oefenopdrachten"
      },
      {
        "title": "All about the UX designer role",
        "type": "Playlist",
        "note": "bekijk alleen de relevante videos, start bovenaan"
      },
      {
        "title": "From Junior to Senior UX/UI designer",
        "note": "Lees ook de top comments"
      },
      {
        "title": "Top UX/UI tricks - Part 1"
      },
      {
        "title": "Top UX/UI tricks - Part 2"
      },
      {
        "title": "How to use text in UI design",
        "note": "Belangrijke technieken om te onthouden"
      }
    ],
    "youtube_channels": [
      "DesignCourse",
      "Flux Academy",
      "AJ&Smart",
      "Jesse Showalter"
    ],
    "extra_research": [
      "Het \"5-second-test\" principe: test of de belangrijkste boodschap direct duidelijk is",
      "Basis HTML en CSS: om structuur en styling van designs te begrijpen",
      "Fundamentele richtlijnen van Google Material Design en Apple Human Interface Guidelines",
      "Online tutorials voor Figma, bijvoorbeeld op YouTube of LinkedIn Learning"
    ]
  }';

  assessment_json jsonb := '{
    "main_task": "Voer zelfstandig een UI/UX project uit zoals het ontwerpen van een eenvoudige website",
    "focus_points": [
      "Toepassen van basisprincipes van UX",
      "Gebruiksvriendelijkheid",
      "Consistentie",
      "Eenvoud in design"
    ],
    "deliverables": [
      "Wireframe",
      "Visueel ontwerp",
      "Basisprototype"
    ],
    "evaluation_criteria": [
      "Gebruiksvriendelijkheid en visuele consistentie",
      "Toepassing van UX-best practices",
      "Basisbegrip van ontwerpprincipes"
    ],
    "presentation": {
      "duration": "30-50 minuten",
      "components": [
        {
          "type": "Presentatie",
          "duration": "15-30 minuten",
          "description": "over het designproces, keuzes en resultaten"
        },
        {
          "type": "Q&A",
          "duration": "10 minuten",
          "description": "waar je vragen beantwoord"
        },
        {
          "type": "Scenarios",
          "duration": "10 minuten",
          "description": "manager schetst scenario om te behandelen"
        }
      ]
    }
  }';

  rewards_extended_json jsonb := '{
    "recognition": "Applaus op de maandagochtend",
    "skills": "Nieuwe skills! Kennis die niemand je meer afneemt",
    "toolkit": {
      "title": "Volledig Ranking Masters design toolkit",
      "items": [
        "Figma paid account",
        "Figma UXeditor.ai account",
        "Figma Ranking Masters library",
        "Adobe Suite",
        "Leonardo AI pro account",
        "Magnific AI pro account"
      ]
    },
    "gift": {
      "amount": "€25,-",
      "options": ["Bol.com", "Amazon", "vvv"]
    },
    "certificate": {
      "title": "Ranking Masters UX/UI Junior Designer Certificaat",
      "formats": ["print", "PDF"]
    }
  }';
BEGIN
  UPDATE levels
  SET 
    description_extended = description_text,
    process = process_json,
    time_investment = time_investment_json,
    learning_materials = learning_materials_json,
    assessment = assessment_json,
    rewards_extended = rewards_extended_json
  WHERE title = 'Junior UX/UI Designer'
    AND EXISTS (
      SELECT 1 FROM paths p
      WHERE p.id = levels.path_id
      AND p.title = 'UX/UI Designer'
    );
END $$;