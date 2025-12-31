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
            "Desgastado", "Desgastado 2",
            "Triste 1", "Triste 2"
        ]
    },
    "Slot Secundário": {
        "Combate": {
            "Combate": [
                "Criança Psíquica", "Tiro Preciso", "Pesado e Sólido"
            ],
            "Penalidades": [
                "Sedentário", "Fique em Casa", "Rei do Poder", "Força Bruta",
                "Corredor de Longa Distância", "Economize Energia", "Calma Vegetativa",
                "Animal de Carga", "Cidadão Urbano", "Durabilidade",
                "Leve Sua Mente", "Corra Mais, Viva Melhor", "Corra Rápido",
                "Rascal da Rua", "Sistema de Dois Turnos", "Bem-estar"
            ]
        },
        "Exploração": [
            "Sedentário", "Fique em Casa", "Rei do Poder", "Força Bruta",
            "Corredor de Longa Distância", "Economize Energia", "Calma Vegetativa",
            "Animal de Carga", "Cidadão Urbano", "Durabilidade",
            "Leve Sua Mente", "Corra Mais, Viva Melhor", "Corra Rápido",
            "Rascal da Rua", "Sistema de Dois Turnos", "Bem-estar"
        ],
        "Território": [
            "Mais Um", "Oráculo Dourado", "Trabalhador Dedicado",
            "Movimento Infinito Imperfeito", "Mapa Vivo",
            "Afinidade com Poeira Estelar", "Fortalecimento Estelar",
            "Sonho Selvagem", "Um Mundo de Encanto"
        ],
        "Fabricação": [
            "Do Zero", "Obra da Proficiência", "Pequeno Ajudante",
            "A Última Noite", "Acelerar", "Compre 1 Leve 2",
            "Talento Mineral", "Venham Como Um Só", "Sem Desperdício",
            "Subproduto", "Espírito da Selva", "Super Copão"
        ]
    },
    "Slot Terciário": {
        "Animais": [
            "Grunhido Superior - Búfalo",
            "Herbívoro - Cervo",
            "Herbívoro - Cabra",
            "Simbiose Ruim - Javali",
            "Regras da Força Bruta - Urso",
            "Animal Polar - Rinoceronte",
            "Ataque à Luz da Lua - Lobo",
            "Pesadelo das Águas - Crocodilo",
            "Massagem Mental - Capivara",
            "Criaturas Felinas - Leopardo"
        ],
        "Móveis": [
            "Ressonância Musical - Jukebox",
            "Adaptação à Poluição - Vaso Moderno",
            "Momento de Precisão - Relógio de Mesa",
            "Carga Extra - Caixa",
            "Cintilação de Néon - Like",
            "Cavaleiros da Távola Redonda - Mesa",
            "Mestre das Temperaturas - Ventilador",
            "Chama Quente - Candelabro",
            "Eureka - Luz Sinal Pequena",
            "Limpa e Higienizada - Pia"
        ]
    },
    "Custom": [
        "Bônus de dano elemental",
        "Ataque",
        "Dano critico",
        "PV"
    ]
};
