// MAIN COMPONENT ---------------------------------------------------------------------------------

const API_KEY = process.env.REACT_APP_GOOGLE_NLU_API_KEY;

class CloudNaturalLanguageAPI {

  static replaceWord(textString, oldWord, newWord, beginOffset) {
    return textString.substring(0, beginOffset) + newWord + textString.substring(beginOffset + oldWord.length, textString.length);
  }

  static async analyzeEntities(text) {

    const nominalisation = {
    fr: {
      "abaisser":"abaissement",
      "abandonner":"abandon",
      "abattre":"abattage arbres, abattement sentiments",
      "abolir":"abolition",
      "abonder":"abondance",
      "abonner":"abonnement",
      "aboutir":"aboutissement",
      "aboyer":"aboiement",
      "abréger":"abréviation lettres, abrègement longueur",
      "abriter":"abri",
      "absoudre":"absolution",
      "abstenir":"abstention",
      "accabler":"accablement",
      "accélérer":"accélération",
      "acclamer":"acclamation",
      "accoucher":"accouchement",
      "accoutumer":"accoutumance",
      "accrocher":"accrochage",
      "accroître":"accroissement",
      "accueillir":"accueil",
      "accumuler":"accumulation",
      "accuser":"accusation",
      "acharner":"acharnement",
      "acheter":"achat",
      "achever":"achèvement",
      "acquérir":"acquisition",
      "acquitter":"acquittement",
      "activer":"activation",
      "actualiser":"actualisation",
      "adapter":"adaptation",
      "adopter":"adoption",
      "additionner":"addition",
      "adhérer":"adhésion",
      "adjoindre":"adjonction",
      "admettre":"admission",
      "administrer":"administration",
      "admirer":"admiration",
      "adorer":"adoration",
      "adoucir":"adoucissement",
      "aérer":"aération",
      "affaiblir":"affaiblissement",
      "affirmer":"affirmation",
      "afficher":"affichage",
      "affronter":"affrontement",
      "agacer":"agacement",
      "aggraver":"aggravation",
      "agir":"action",
      "agoniser":"agonie",
      "agrafer":"agrafage",
      "agrandir":"agrandissement",
      "aider":"aide",
      "aimer":"amour",
      "ajourner":"ajournement",
      "alerter":"alerte",
      "aligner":"alignement",
      "alimenter":"alimentation",
      "alléger":"allégement",
      "allonger":"allongement",
      "allumer":"allumage",
      "alourdir":"alourdissement",
      "alunir":"alunissage",
      "amarrer":"amarrage",
      "améliorer":"amélioration",
      "aménager":"aménagement",
      "amerrir":"amerrissage",
      "atterrir":"atterrissage",
      "amincir":"amincissement",
      "amonceler":"amoncellement",
      "amortir":"amortissement",
      "amplifier":"amplification",
      "amputer":"amputation",
      "amuser":"amusement",
      "analyser":"analyse",
      "anéantir":"anéantissement",
      "animer":"animation",
      "annexer":"annexion",
      "annoncer":"annonce",
      "annuler":"annulation",
      "apaiser":"apaisement",
      "aplanir":"aplanissement",
      "apparaître":"apparition",
      "appeler":"appel",
      "applaudir":"applaudissement",
      "appliquer":"application",
      "apporter":"apport",
      "apprécier":"appréciation",
      "apprivoiser":"apprivoisement",
      "approcher":"approche",
      "approfondir":"approfondissement",
      "approuver":"approbation",
      "arrêter":"arrêt, arrestation",
      "arriver":"arrivée",
      "arroser":"arrosage, arrosement",
      "articuler":"articulation",
      "asphyxier":"asphyxie",
      "assassiner":"assassinat",
      "asservir":"asservissement",
      "attaquer":"attaque",
      "attendre":"attente",
      "augmenter":"augmentation",
      "autoriser":"autorisation",
      "avorter":"avortement",
      "avouer":"aveu",
      "sebagarrer":"bagarre",
      "baigner":"bain",
      "bâiller":"bâillement",
      "bégayer":"bégaiement",
      "bêler":"bêlement",
      "bénir":"bénédiction",
      "bavarder":"bavardage",
      "blêmir":"blêmissement",
      "bloquer":"blocage",
      "bondir":"bond",
      "bourdonner":"bourdonnement",
      "boycotter":"boycottage",
      "bronzer":"bronzage",
      "cambrioler":"cambriolage",
      "capituler":"capitulation",
      "capturer":"capture",
      "célébrer":"célébration",
      "censurer":"censure",
      "chahuter":"chahut",
      "changer":"changement, change argent",
      "chanter":"chant",
      "charger":"chargement",
      "choisir":"choix",
      "circuler":"circulation",
      "cirer":"cirage",
      "collaborer":"collaboration",
      "commencer":"commencement, début",
      "comparer":"comparaison",
      "conclure":"conclusion",
      "condamner":"condamnation",
      "conduire":"conduite",
      "confirmer":"confirmation",
      "conquérir":"conquête",
      "consentir":"consentement",
      "consoler":"consolation",
      "consommer":"consommation",
      "construire":"construction",
      "contaminer":"contamination souillure, contagion maladie",
      "contempler":"contemplation",
      "contester":"contestation",
      "contraindre":"contrainte",
      "contrôler":"contrôle",
      "convoquer":"convocation",
      "coopérer":"coopération",
      "coordonner":"coordination",
      "corrompre":"corruption",
      "corriger":"correction",
      "créer":"création",
      "cueillir":"cueillette",
      "cuire":"cuisson",
      "débarquer":"débarquement",
      "sedébarrasser":"débarras",
      "déboiser":"déboisement",
      "décharger":"déchargement de marchandises, décharge pour un travail",
      "déchiffrer":"déchiffrement, déchiffrage",
      "décider":"décision",
      "déclarer":"déclaration",
      "démolir":"démolition",
      "dépeindre":"description",
      "déporter":"déportation",
      "déprimer":"dépression, déprime",
      "dérailler":"déraillement",
      "déranger":"dérangement",
      "déraper":"dérapage",
      "détruire":"destruction",
      "dévaster":"dévastation",
      "développer":"développement",
      "diminuer":"diminution",
      "diriger":"direction",
      "discuter":"discussion",
      "disparaître":"disparition",
      "disperser":"dispersion",
      "disqualifier":"disqualification",
      "dissimuler":"dissimulation",
      "distinguer":"distinction",
      "distraire":"distraction",
      "distribuer":"distribution",
      "divertir":"divertissement",
      "dominer":"domination",
      "éblouir":"éblouissement",
      "échanger":"échange",
      "échapper":"échappement",
      "éclairer":"éclairage",
      "effondrer":"effondrement",
      "élargir":"élargissement",
      "électrifier":"électrification",
      "électrocuter":"électrocution",
      "éliminer":"élimination",
      "élire":"élection",
      "émanciper":"émancipation",
      "embarquer":"embarquement",
      "embarrasser":"embarras",
      "embellir":"embellissement",
      "émouvoir":"émotion",
      "employer":"emploi",
      "empoisonner":"empoisonnement",
      "emprunter":"emprunt",
      "encercler":"encerclement",
      "encombrer":"encombrement",
      "enfreindre":"infraction toujours: à qch.",
      "enfuir":"fuite",
      "engager":"engagement",
      "enlever":"enlèvement",
      "enrichir":"enrichissement",
      "enrouer":"enrouement",
      "enseigner":"enseignement",
      "entrer":"entrée",
      "envahir":"invasion",
      "envoyer":"envoi",
      "épouser":"mariage",
      "éteindre":"extinction",
      "étreindre":"étreinte",
      "évacuer":"évacuation",
      "évader":"évasion",
      "évanouir":"évanouissement",
      "évoluer":"évolution",
      "exagérer":"exagération",
      "examiner":"examen",
      "exécuter":"exécution",
      "expliquer":"explication",
      "exploiter":"exploitation",
      "explorer":"exploration",
      "exploser":"explosion",
      "exporter":"exportation",
      "exposer":"exposition de tableaux, exposé discours",
      "expulser":"expulsion",
      "extrader":"extradition",
      "exterminer":"extermination",
      "fabriquer":"fabrication",
      "fermer":"fermeture",
      "fondre":"fonte",
      "former":"formation",
      "fouiller":"fouille",
      "fuir":"fuite",
      "gagner":"gain argent",
      "gagner":"victoire au jeu",
      "guérir":"guérison",
      "guider":"guidage",
      "haïr":"haine",
      "hésiter":"hésitation",
      "imiter":"imitation",
      "immigrer":"immigration",
      "inaugurer":"inauguration",
      "inculper":"inculpation",
      "indemniser":"indemnisation",
      "indigner":"indignation",
      "indiquer":"indication",
      "initier":"initiation",
      "injecter":"injection",
      "inonder":"inondation",
      "inspecter":"inspection",
      "installer":"installation",
      "instruire":"instruction",
      "interdire":"interdiction",
      "interrompre":"interruption",
      "intervenir":"intervention",
      "intimider":"intimidation",
      "introduire":"introduction",
      "inviter":"invitation",
      "isoler":"isolation, isolement solitude",
      "kidnapper":"kidnappage, kidnapping",
      "lancer":"lancement",
      "larguer":"largage",
      "libérer":"libération",
      "licencier":"licenciement",
      "lire":"lecture",
      "livrer":"livraison",
      "lyncher":"lynchage",
      "maigrir":"amaigrissement",
      "maintenir":"maintien",
      "manifester":"manifestation",
      "manipuler":"manipulation",
      "manoeuvrer":"manoeuvre",
      "marcher":"marche",
      "marier":"mariage",
      "massacrer":"massacre",
      "maudire":"malédiction",
      "médire":"médisance",
      "mécontenter":"mécontentement",
      "méditer":"méditation",
      "seméfier":"méfiance",
      "mentir":"mensonge",
      "mépriser":"mépris",
      "seméprendre":"méprise",
      "modifier":"modification",
      "mordre":"morsure",
      "mourir":"mort",
      "mouvoir":"mouvement",
      "naître":"naissance",
      "nettoyer":"nettoyage nettoiement",
      "omettre":"omission",
      "ouvrir":"ouverture",
      "parachuter":"parachutage",
      "partir":"départ",
      "passer":"passage",
      "peindre":"peinture",
      "perdre":"perte",
      "persécuter":"persécution",
      "piller":"pillage",
      "plonger":"plongée",
      "polluer":"pollution",
      "poursuivre":"poursuite",
      "prédire":"prédiction",
      "prendre":"prise",
      "préparer":"préparation",
      "prêter":"prêt",
      "prévoir":"prévision météo, prévoyance prudence",
      "produire":"production",
      "prolonger":"prolongation",
      "prouver":"preuve",
      "protéger":"protection",
      "publier":"publication",
      "rapatrier":"rapatriement",
      "regretter":"regret",
      "répéter":"répétition",
      "reprendre":"reprise",
      "répliquer":"réplique",
      "résoudre":"solution",
      "serésoudreà":"résolution",
      "revenir":"retour",
      "réussir":"réussite",
      "rompre":"rupture",
      "sacrifier":"sacrifice",
      "satisfaire":"satisfaction",
      "sauver":"sauvetage",
      "sortir":"sortie",
      "supprimer":"suppression",
      "suspendre":"suspension",
      "terminer":"terminaison, fin",
      "transformer":"transformation",
      "transgresser":"transgression",
      "trépasser":"trépas",
      "tuer":"meurtre, assassinat, tuerie en masse",
      "user":"usage",
      "utiliser":"utilisation",
      "vacciner":"vaccination",
      "venir":"venue",
      "violer":"viol",
      "visiter":"visite",
      "voler":"vol Flug, Diebstahl",
      "être sincère":"sincérité",
      "être honnête":"honnêteté",
      "être gai":"gaîté",
      "être heureux":"bonheur",
      "être loyal":"loyauté", "être là":"présence", "être absent":"absence", "ne pas être là":"absence", "fumer":"fumée, fumeur, cigarrette", "rappeler":"rappel", "ouvrer":"ouverture", "communiquer":"communication", "neiger": "hiver, neige", "pleuvoir": "pluie, averse"
    },
    en: {"enable":"ability", "accept":"acceptance", "accuse":"accusation", "achieve":"achievement", "act":"act, action, activity", "add":"addition", "admire":"admiration", "advise":"advice", "agree":"agreement", "anger":"anger", "appreciate":"appreciation", "approve":"approval", "approximate":"approximation", "argue":"argument", "attend":"attention", "attract":"attraction", "base":"base, basis", "beautify":"beauty", "believe":"belief", "bore":"bore, boredom", "breathe":"breath", "calm":"calm, calmness", "care":"care", "centralize":"centre, centralization", "characterize":"character", "circulate":"circulation", "clean":"cleanliness", "clear":"clarity, clearance", "collect":"collection", "colour":"colour", "comfort":"comfort", "compare":"comparison", "compete":"competition", "complete":"completion", "conclude":"conclusion", "condition":"condition", "confide":"confidence", "confuse":"confusion", "consider":"consideration", "continue":"continuation, continuity", "cool":"cool, coolness", "correct":"correction, correctness", "create":"creation, creativity", "criticize":"critic", "accustom":"custom", "dare":"dare", "darken":"dark, darkness", "deaden":"death", "deceive":"deceit, deception", "decide":"decision", "decorate":"decoration", "deepen":"deep, depth", "defend":"defence", "define":"definition", "demonstrate":"demonstration", "depend":"dependent, dependence", "describe":"description", "destroy":"destruction", "determine":"determination", "differentiate":"difference", "direct":"direction", "disagree":"disagreement", "disappoint":"disappointment", "distance":"distance", "disturb":"disturbance", "doubt":"doubt", "dream":"dream", "dress":"dress", "drink":"drink, drunkenness", "ease":"ease, easiness", "educate":"education", "effect":"effect, effectiveness", "electrify":"electricity", "embarrass":"embarrassment", "emphasize":"emphasis", "encourage":"encouragement", "end":"end", "energize":"energy", "enjoy":"enjoyment", "entertain":"entertainment", "enthuse":"enthusiasm", "equalize":"equality", "excel":"excellence", "excite":"excitement", "excuse":"excuse", "expect":"expectation", "expend":"expenditure, expense", "experiment":"experiment", "explain":"explanation", "explode":"explosion", "express":"expression", "familiarize":"familiarity", "fashion":"fashion", "fear":"fear", "finalize":"final", "fish":"fish, fishing", "fit":"fit", "force":"force", "forget":"forgetfulness", "formalize":"formality", "frequent":"frequency", "freshen":"freshness", "frighten":"fright", "harden":"hardship", "harm":"harm, harmfulness", "overheat":"heat", "help":"help", "hope":"hope", "hurry":"hurry", "hurt":"hurt", "ice":"ice", "imagine":"imagination", "impress":"impression", "increase":"increase", "infect":"infection", "insist":"insistence", "instruct":"instruction", "intend":"intent, intention", "interest":"interest", "invent":"invention", "invite":"invitation, invite", "know":"knowledge", "enlarge":"enlargement", "laugh":"laugh", "outlaw":"law", "legalize":"legality", "lengthen":"length", "lighten":"light", "locate,":"location", "love":"love", "lower":"low", "man":"man, mankind", "mark":"mark", "match":"match", "materialize":"material, materialism", "mean":"meaning, meaningfulness", "measure":"measurement", "memorize":"memory", "mind":"mind, mindlessness", "minimize":"minimum", "mistake":"mistake", "moralize":"moral, morality", "mother":"mother, motherhood", "move":"move, movement", "murder":"murder", "rename":"name", "nationalize":"nation, nationalization, nationality", "naturalize":"nature, naturalist, naturalization", "necessitate":"necessity", "need":"need", "unnerve":"nerve, nervousness", "renew":"news, newness", "normalize":"normality", "notice":"notice", "obey":"obedience", "offend":"offence", "officiate":"office", "open":"openness", "operate":"operation", "cooperate":"operation", "opt":"option", "originate":"origin", "pain":"pain", "part":"part, partition", "impart":"part, partition", "pacify":"peace", "perfect":"perfection", "personalize":"person, personality", "personify":"person, personality", "persuade":"persuasion, persuasiveness", "play":"play, playfulness", "outplay":"play, playfulness", "please":"pleasure", "point":"point, pointlessness", "politicize":"politics", "popularize":"popularity", "power, empower":"power", "prefer":"preference", "present":"presence, presentation,", "privatize":"privacy, privatization", "profit":"profit, profitability", "progress":"progress, progression", "provide":"provision", "publicize":"public, publicity", "punish":"punishment", "purify":"purification, purity", "question":"question", "quieten":"quiet", "race":"race", "realize":"realism, reality", "reason":"reason", "receive":"receipt, reception,", "recognize":"recognition", "reflect":"reflection", "regret":"regret", "regulate":"regular, regularity", "relate":"relation, relationship", "rely":"reliability", "remark":"remark", "repair":"repair", "repeat":"repeat, repetition", "report":"report", "respect":"respect", "respond":"response, responsiveness", "rest":"rest", "enrich":"riches, richness", "right":"right, rightness,", "romanticize":"romance, romanticism", "roughen":"rough, roughness", "round":"round", "sadden":"sadness", "satisfy":"satisfaction", "school":"school, pre-school", "search":"search, research", "research":"search, research", "sense":"sense, sensibility, sensitivity, sensitiveness", "sensitize":"sense, sensibility, sensitivity, sensitiveness", "separate":"separation", "shake":"shake, shakiness", "shape":"shape", "sharpen":"sharpness", "shock":"shock", "shorten":"short, shortness", "shy":"shyness", "sicken":"sick, sickness", "signify":"significance", "silence":"silence", "simplify":"simplicity, simplification", "single":"single", "sleep":"sleep, sleepiness", "socialize":"society,", "soften":"softness", "solidify":"solid, solidity", "specialize":"specialty", "speed":"speed, speediness", "spot":"spot", "stand":"stand, standstill", "withstand":"stand, standstill", "steepen":"steepness", "stiffen":"stiffness", "strengthen":"strength", "strike":"strike", "structure":"structure, structuralism", "study":"student, study", "style":"style, stylishness", "substantiate":"substance", "succeed":"success, succession", "suggest":"suggestion", "support":"support, supportiveness", "suppose":"supposition", "presuppose":"supposition", "surprise":"surprise", "suspect":"suspect, suspicion", "sweeten":"sweet, sweetness", "symbolize":"symbol, symbolism", "sympathize":"sympathy", "systematize":"system, systematization", "talk":"talk, talks", "taste":"taste", "thank":"thanks, thankfulness", "theorize":"theory, theorem", "thicken":"thick, thickness", "thin":"thinness", "think":"thought, thoughtfulness,", "threaten":"threat", "tighten":"tightness", "tire":"tiredness", "touch":"touch", "trouble":"trouble", "trust":"trust, trusteeship", "entrust":"trust, trusteeship", "typify":"type", "understand":"understanding", "use":"usage, use", "vary":"variant, variety, variation", "violate":"violence", "wrong":"wrong", "warm":"warmth", "waste":"wastage, waste", "watch":"watch, watchfulness", "weaken":"weakness", "weigh":"weight", "outweigh":"weight", "widen":"width", "wonder":"wonder", "worry":"worry", "write":"writing", "rewrite":"writing",}
    }

    const stopWords = {
      fr: ["!", "moment", "qu'il", "qu'elle", "qu'ils", "qu'elles", "s'", "a","à","â","abord","afin","ah","ai","aie","ainsi","allaient","allo","allô","allons","après","assez","attendu","au","aucun","aucune","aujourd","aujourd'hui","auquel","aura","auront","aussi","autre","autres","aux","auxquelles","auxquels","avaient","avais","avait","avant","avec","avoir","ayant","b","bah","beaucoup","bien","bigre","boum","bravo","brrr","c","ça","car","ce","ceci","cela","celle","celle-ci","celle-là","celles","celles-ci","celles-là","celui","celui-ci","celui-là","cent","cependant","certain","certaine","certaines","certains","certes","ces","cet","cette","ceux","ceux-ci","ceux-là","chacun","chaque","cher","chère","chères","chers","chez","chiche","chut","ci","cinq","cinquantaine","cinquante","cinquantième","cinquième","clac","clic","combien","comme","comment","compris","concernant","contre","couic","crac","d","da","dans","de","debout","dedans","dehors","delà","depuis","derrière","des","dès","désormais","desquelles","desquels","dessous","dessus","deux","deuxième","deuxièmement","devant","devers","devra","différent","différente","différentes","différents","dire","divers","diverse","diverses","dix","dix-huit","dixième","dix-neuf","dix-sept","doit","doivent","donc","dont","douze","douzième","dring","du","duquel","durant","e","effet","eh","elle","elle-même","elles","elles-mêmes","en","encore","entre","envers","environ","es","ès","est","et","etant","étaient","étais","était","étant","etc","été","etre","être","eu","euh","eux","eux-mêmes","excepté","f","façon","fais","faisaient","faisant","fait","feront","fi","flac","floc","font","g","gens","h","ha","hé","hein","hélas","hem","hep","hi","ho","holà","hop","hormis","hors","hou","houp","hue","hui","huit","huitième","hum","hurrah","i","il","ils","importe","j","je","jusqu","jusque","k","l","la","là","laquelle","las","le","lequel","les","lès","lesquelles","lesquels","leur","leurs","longtemps","lorsque","lui","lui-même","m","ma","maint","mais","malgré","me","même","mêmes","merci","mes","mien","mienne","miennes","miens","mille","mince","moi","moi-même","moins","mon","moyennant","n","na","ne","néanmoins","neuf","neuvième","ni","nombreuses","nombreux","non","nos","notre","nôtre","nôtres","nous","nous-mêmes","nul","o","o|","ô","oh","ohé","olé","ollé","on","ont","onze","onzième","ore","ou","où","ouf","ouias","oust","ouste","outre","p","paf","pan","par","parmi","partant","particulier","particulière","particulièrement","pas","passé","pendant","personne","peu","peut","peuvent","peux","pff","pfft","pfut","pif","plein","plouf","plus","plusieurs","plutôt","pouah","pour","pourquoi","premier","première","premièrement","près","proche","psitt","puisque","q","qu","quand","quant","quanta","quant-à-soi","quarante","quatorze","quatre","quatre-vingt","quatrième","quatrièmement","que","quel","quelconque","quelle","quelles","quelque","quelques","quelqu'un","quels","qui","quiconque","quinze","quoi","quoique","r","revoici","revoilà","rien","s","sa","sacrebleu","sans","sapristi","sauf","se","seize","selon","sept","septième","sera","seront","ses","si","sien","sienne","siennes","siens","sinon","six","sixième","soi","soi-même","soit","soixante","son","sont","sous","stop","suis","suivant","sur","surtout","t","ta","tac","tant","te","té","tel","telle","tellement","telles","tels","tenant","tes","tic","tien","tienne","tiennes","tiens","toc","toi","toi-même","ton","touchant","toujours","tous","tout","toute","toutes","treize","trente","très","trois","troisième","troisièmement","trop","tsoin","tsouin","tu","u","un","une","unes","uns","v","va","vais","vas","vé","vers","via","vif","vifs","vingt","vivat","vive","vives","vlan","voici","voilà","vont","vos","votre","vôtre","vôtres","vous","vous-mêmes","vu","w","x","y","z","zut","alors","aucuns","bon","devrait","dos","droite","début","essai","faites","fois","force","haut","ici","juste","maintenant","mine","mot","nommés","nouveaux","parce","parole","personnes","pièce","plupart","seulement","soyez","sujet","tandis","valeur","voie","voient","état","étions"],
      en: ["0o", "0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz"],
    }

    let body = {
      "document":{
        "type": "PLAIN_TEXT",
        "content": text
      },
      "encodingType":"UTF16"
    }

    let options = {
        'method': 'post', 
        'mode': 'cors', 
        'cache': 'no-cache',
        'redirect': 'follow',
        'referrerPolicy': 'no-referrer',
        'headers': { 'Content-Type': 'application/json' },
        'body': JSON.stringify(body)
      };

      try {

      // Fetch data and get JSON result.
      let Response = await fetch(`https://language.googleapis.com/v1/documents:analyzeSyntax?key=${API_KEY}`,options);

      let Result = await Response.json();
      let verbs = [];
      let adjs = [];
      let originalTextLength = text.length;

      if(!Result) return null

      if(Result) {
        console.log('annotateText', Result);
        if (Result.tokens) {
          /* verbs = Result.tokens.filter(token => token.partOfSpeech.tag === "VERB"); */
          adjs = Result.tokens.filter(token => token.partOfSpeech.tag === "ADJ");

          /* text = ''; */

          Result.tokens.forEach(token => {

            let newWord = token.lemma;

            if (token.partOfSpeech.tag === "VERB") {

              let noun = nominalisation[Result.language][newWord.toLowerCase()];
            
              if (noun) {
                newWord = noun;
              } else {
                console.log('Nominalisation non existante :', newWord.toLowerCase());
              }

            }

            /* if (stopWords[Result.language].includes(newWord.toLowerCase())) {
              newWord = '';
            } */

            text = this.replaceWord(text, token.text.content, newWord + " ", token.text.beginOffset - (originalTextLength - text.length));
            /* text += `${newWord} `; */

          });

          /* verbs.forEach(verb => {

            var stringToGoIntoTheRegex = verb.lemma.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var regex = new RegExp(stringToGoIntoTheRegex + "\\b");

            let noun = nominalisation[Result.language][verb.lemma.toLowerCase()];
            
            if (noun) {
              text = text.replace(regex, `${noun}`);
            } else {
              console.log('Nominalisation non existante :', verb.lemma.toLowerCase());
            }

          }); */

          console.log('Nominalisation : ', text);

          /* let wordArray = text.replaceAll(",","").replaceAll(".","").replaceAll("!","").replaceAll("?","").split(" ");

          wordArray.forEach((word, idx) => {
            let stopWord = stopWords[Result.language].includes(word.toLowerCase());

            if (stopWord) {
              var stringToGoIntoTheRegex = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
              var regex = new RegExp(stringToGoIntoTheRegex + "\\b");  

              text = text.replace(regex, "");
              
            }
          }); */

          text = text.replace(/  +/g, ' ');

          console.log("Stop Words : ", text);

        }

        let body2 = {
          "document":{
            "type": "PLAIN_TEXT",
            "content": text
          },
          "encodingType":"UTF16"
        }
    
        let options2 = {
            'method': 'post', 
            'mode': 'cors', 
            'cache': 'no-cache',
            'redirect': 'follow',
            'referrerPolicy': 'no-referrer',
            'headers': { 'Content-Type': 'application/json' },
            'body': JSON.stringify(body2)
          };


        let Response2 = await fetch(`https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}`,options2);

        let Result2 = await Response2.json();

        if(!Result2) return null

        if(Result2) {

          adjs.forEach(adj => {
            Result2.entities.push({
              "name": adj.lemma,
              "type": "CONSUMER_GOOD",
              "metadata": {},
              "salience": 0.07,
            });
          });

          return Result2;
        }
      }

      return null;

    } catch(Err) {
      console.log('analyzeEntities',Err);
      return [];
    }

  }

}


// EXPORT -----------------------------------------------------------------------------------------

export default CloudNaturalLanguageAPI;
