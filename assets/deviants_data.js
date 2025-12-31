const deviants = {
    "CAOS": {
        "Combate": [
            { id: "chaossauro_caos_combate", nome: "Chaossauro", imgs: ["assets/deviants/CAOS/combate/chaossauro/chaossauro1.png"], type: "CAOS", category: "Combate" },
            { id: "espirito_caos_combate", nome: "Espírito", imgs: ["assets/deviants/CAOS/combate/espirito/espirito1.png"], type: "CAOS", category: "Combate" },
            { id: "wish_caos_combate", nome: "Wish", imgs: ["assets/deviants/CAOS/combate/wish/wish1.png"], type: "CAOS", category: "Combate" }
        ],
        "Territorio": [
            { id: "gato_caos_territorio", nome: "Gato", imgs: ["assets/deviants/CAOS/territorio/gato/gato1.png"], type: "CAOS", category: "Território" }
        ]
    },
    "PADRAO": {
        "Combate": [
            { id: "cebola_padrao_combate", nome: "Cebola", imgs: ["assets/deviants/PADRAO/combate/cebola/cebola1.png", "assets/deviants/PADRAO/combate/cebola/cebola2.png"], type: "PADRAO", category: "Combate" },
            { id: "donzela_padrao_combate", nome: "Donzela", imgs: ["assets/deviants/PADRAO/combate/donzela/donzela1.png", "assets/deviants/PADRAO/combate/donzela/donzela2.png"], type: "PADRAO", category: "Combate" },
            { id: "teddy_padrao_combate", nome: "Teddy", imgs: ["assets/deviants/PADRAO/combate/teddy/teddy1.png", "assets/deviants/PADRAO/combate/teddy/teddy2.png"], type: "PADRAO", category: "Combate" },
            { id: "vazio_padrao_combate", nome: "Vazio", imgs: ["assets/deviants/PADRAO/combate/vazio/vazio1.png"], type: "PADRAO", category: "Combate" }
        ],
        "Territorio": [
            { id: "gato_padrao_territorio", nome: "Gato", imgs: ["assets/deviants/PADRAO/territorio/gato/gato1.png"], type: "PADRAO", category: "Território" }
        ],
        "Fabricacao": [
            { id: "gengibre_padrao_fabricacao", nome: "Gengibre", imgs: ["assets/deviants/PADRAO/fabricar/gengibre/gengibre1.png"], type: "PADRAO", category: "Fabricação" }
        ]
    }
};

const traitsData = {
    "Slot Primário": {
        "Combate": [
            "Vantagem Suprema", "Energia Estável", "Vitalidade Estável"
        ],
        "Humor": [
            "Otimista 1", "Otimista 2", "Otimista 3", "Otimista 4", "Otimista 5"
        ],
        "Poder de Mutação": [
            "Energia Oculta 1", "Energia Oculta 2", "Energia Oculta 3", "Energia Oculta 4", "Energia Oculta 5"
        ],
        "Recuperação": [
            "Desperte e Brilhe 1", "Desperte e Brilhe 2", "Desperte e Brilhe 3", "Desperte e Brilhe 4", "Desperte e Brilhe 5",
            "Reverter de Poder 1", "Reverter de Poder 2"
        ],
        "Penalidades": [
            "Dores de Crescimento 1", "Dores de Crescimento 2", "Dores de Crescimento 3",
            "Anime-se 1", "Anime-se 2", "Anime-se 3",
            "Desgastado 1", "Desgastado 2",
            "Triste 1", "Triste 2"
        ]
    },
    "Slot Secundário": {
        "Combate": [
            "Criança Psíquica", "Tiro Preciso", "Pesado e Sólido"
        ],
        "Exploração": [
            "Rei do Poder", "Força Bruta", "Corredor de Longa Distância", "Animal de Carga"
        ],
        "Território": [
            "Mais Um", "Oráculo Dourado", "Afinidade com Poeira Estelar"
        ],
        "Fabricação": [
            "Do Zero", "Obra da Proficiência", "A Última Noite", "Acelerar", "Espírito da Selva"
        ]
    },
    "Slot Terciário": {
        "Animais": [
            "Assalto à Luz da Lua (Lobo)",
            "Criaturas Felinas (Leopardo)",
            "Regras da Força Bruta (Urso)",
            "Massagem Mental (Capivara)",
            "Adaptação à Poluição (Vaso Moderno)",
            "Momento de Precisão (Relógio)"
        ]
    },
    "Custom": [
        "Bônus de dano elemental",
        "Ataque",
        "Dano critico",
        "PV"
    ]
};
