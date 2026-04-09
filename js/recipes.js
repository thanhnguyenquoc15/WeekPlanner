// ── Recipe Database ────────────────────────────────────────────────
// Keyed by stable dish ID matching mealPool[category][n].id
// ingredients: grouped by type for easy shopping
// steps: numbered preparation steps

export const RECIPE_DB = {

    // ── LUNCH ─────────────────────────────────────────────────────

    'com-tam-suon-bi-cha': {
        name: 'Cơm tấm sườn bì chả',
        prepTime: '20 min',
        cookTime: '35 min',
        tip: 'Marinate sườn overnight in the fridge for deeper flavour. Broken rice cooks faster than jasmine — reduce water by 10%.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Sườn heo (thin-cut pork chop)', amount: '200 g' },
                    { item: 'Bì heo (shredded pork skin)', amount: '50 g, pre-cooked' },
                    { item: 'Chả heo (steamed pork cake / chả lụa)', amount: '60 g' },
                    { item: 'Trứng gà', amount: '1 egg (for chả trứng)' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo tấm (broken rice)', amount: '150 g dry' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Cà chua (tomato)', amount: '1 medium' },
                    { item: 'Dưa leo (cucumber)', amount: '½, sliced' },
                    { item: 'Giá đỗ (bean sprouts)', amount: 'small handful' },
                ],
            },
            {
                group: 'Marinade & Sauce',
                items: [
                    { item: 'Nước mắm (fish sauce)', amount: '2 tbsp' },
                    { item: 'Đường (sugar)', amount: '1 tbsp' },
                    { item: 'Tỏi băm (minced garlic)', amount: '1 tsp' },
                    { item: 'Sả băm (minced lemongrass)', amount: '1 tsp' },
                    { item: 'Dầu hào (oyster sauce)', amount: '1 tbsp' },
                    { item: 'Nước mắm pha (dipping fish sauce)', amount: '3 tbsp' },
                    { item: 'Ớt, chanh (chilli & lime)', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Mix fish sauce, sugar, garlic, lemongrass, and oyster sauce. Coat pork chop and marinate at least 30 min (overnight best).',
            'Cook broken rice with slightly less water than normal; rest 10 min after cooking.',
            'Grill or pan-fry marinated chop on high heat ~4 min per side until charred and cooked through.',
            'Serve chop over rice with bì, sliced chả, cucumber, tomato, and bean sprouts.',
            'Drizzle with prepared nước mắm pha (fish sauce + sugar + lime + chilli + water 1:1:1:0.5:3).',
        ],
    },

    'pho-bo-tai-nam': {
        name: 'Phở bò tái nạm',
        prepTime: '15 min',
        cookTime: '4 h (broth) + 10 min',
        tip: 'For weekday use, buy pre-made phở broth (nước dùng phở) at the market and just simmer 20 min with spices. Slice tái very thin and let hot broth cook it in the bowl.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò nạm (beef brisket/flank)', amount: '120 g, slow-cooked' },
                    { item: 'Thịt bò tái (raw beef sirloin or eye round)', amount: '80 g, paper-thin slices' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bánh phở (flat rice noodles)', amount: '150 g fresh' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Xương bò (beef bones)', amount: '500 g' },
                    { item: 'Gừng (ginger, charred)', amount: '1 knob' },
                    { item: 'Hành tây (onion, charred)', amount: '1 medium' },
                    { item: 'Star anise', amount: '3 pods' },
                    { item: 'Quế (cinnamon stick)', amount: '1 small' },
                    { item: 'Đinh hương (cloves)', amount: '4 pieces' },
                    { item: 'Thảo quả (black cardamom)', amount: '1 pod' },
                    { item: 'Nước mắm', amount: '2 tbsp' },
                    { item: 'Muối, đường', amount: 'to taste' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Hành lá, ngò (spring onion, cilantro)', amount: 'handful' },
                    { item: 'Giá đỗ (bean sprouts)', amount: 'handful' },
                    { item: 'Húng quế (Thai basil)', amount: 'handful' },
                    { item: 'Chanh, ớt (lime, chilli)', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blanch beef bones in boiling water 5 min, discard water, rinse bones.',
            'Char ginger and onion directly on flame until blackened. Rinse off char.',
            'Toast spices (star anise, cinnamon, cloves, cardamom) in dry pan 2 min until fragrant.',
            'Simmer bones in 2 L water 3–4 h, skimming foam. Add charred aromatics and spices. Season with fish sauce and salt.',
            'Strain broth. Thinly slice cooked nạm brisket. Arrange tái slices in bowl.',
            'Blanch noodles 30 sec, drain. Add noodles, nạm, and tái to bowl. Ladle boiling broth over — it cooks the tái.',
            'Top with spring onion, cilantro. Serve with sprouts, basil, lime, and chilli on the side.',
        ],
    },

    'bun-bo-hue': {
        name: 'Bún bò Huế',
        prepTime: '20 min',
        cookTime: '2 h',
        tip: 'The key flavour is mắm ruốc (shrimp paste) — use it sparingly and dissolve in broth first. Sả (lemongrass) and ớt paste give the distinctive spicy-red colour.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò bắp (beef shank)', amount: '200 g' },
                    { item: 'Giò heo (pork hock)', amount: '150 g (optional)' },
                    { item: 'Chả lụa / chả Huế', amount: '60 g, sliced' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún bò Huế (thick round rice noodles)', amount: '150 g' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Xương heo (pork bones)', amount: '300 g' },
                    { item: 'Sả (lemongrass stalks, smashed)', amount: '4 stalks' },
                    { item: 'Mắm ruốc (fermented shrimp paste)', amount: '1 tbsp' },
                    { item: 'Ớt bột (chilli powder)', amount: '1–2 tsp' },
                    { item: 'Dầu annatto (annatto oil)', amount: '2 tbsp' },
                    { item: 'Nước mắm, muối', amount: 'to taste' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Bắp chuối bào (shredded banana blossom)', amount: 'handful' },
                    { item: 'Giá đỗ, húng quế', amount: 'handful each' },
                    { item: 'Hành lá, ngò gai', amount: 'handful' },
                    { item: 'Chanh, ớt tươi', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blanch pork bones 5 min, rinse. Simmer in 2 L water 1.5 h, skim foam.',
            'Add smashed lemongrass and beef shank; simmer 45 min until beef is tender.',
            'Dissolve mắm ruốc in ¼ cup hot broth separately; add gradually to main pot, tasting as you go.',
            'Heat annatto oil in small pan, add chilli powder, stir 30 sec. Add to broth for colour.',
            'Season with fish sauce and salt. Slice beef shank thinly.',
            'Blanch noodles. Bowl up noodles, beef, pork hock, and chả. Ladle hot broth over.',
            'Serve with banana blossom, sprouts, herbs, lime, and fresh chilli.',
        ],
    },

    'com-suon-nuong-canh-cai': {
        name: 'Cơm sườn nướng + Canh cải',
        prepTime: '15 min',
        cookTime: '25 min',
        tip: 'Blanching the pork ribs before marinating removes impurities and makes the final dish cleaner. Use gạo Jasmine for fluffy rice that pairs well with the canh.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Sườn heo (pork spare ribs)', amount: '250 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo Jasmine', amount: '150 g dry' },
                ],
            },
            {
                group: 'Vegetables (Canh)',
                items: [
                    { item: 'Cải xanh (mustard greens) or cải thảo', amount: '200 g' },
                    { item: 'Cà rốt (carrot)', amount: '½ medium, sliced' },
                    { item: 'Hành lá', amount: '2 stalks' },
                ],
            },
            {
                group: 'Marinade & Seasoning',
                items: [
                    { item: 'Nước mắm', amount: '2 tbsp' },
                    { item: 'Đường', amount: '1 tbsp' },
                    { item: 'Tỏi băm', amount: '1 tsp' },
                    { item: 'Hạt nêm (seasoning powder)', amount: '1 tsp' },
                    { item: 'Dầu hào', amount: '1 tbsp' },
                    { item: 'Muối, tiêu', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blanch ribs in boiling water 3 min, rinse. Mix marinade and coat ribs; rest 20 min.',
            'Cook rice per instructions.',
            'Grill ribs on medium-high heat 6–8 min per side until charred and cooked through.',
            'For canh: bring 600 mL water to boil, add carrot and simmer 5 min. Add greens, season with seasoning powder and salt, simmer 3 min.',
            'Serve ribs over rice with canh on the side. Garnish canh with spring onion.',
        ],
    },

    'bun-thit-nuong': {
        name: 'Bún thịt nướng (+ chả giò)',
        prepTime: '20 min',
        cookTime: '20 min',
        tip: 'Slice pork belly thinly across the grain for tender results. Soak vermicelli in cold water 15 min before boiling to prevent clumping.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt ba chỉ (pork belly) or thịt vai', amount: '180 g, thin slices' },
                    { item: 'Chả giò (spring rolls, store-bought)', amount: '2–3 pieces' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún tươi (thin rice vermicelli)', amount: '150 g' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Rau xà lách (lettuce)', amount: 'handful' },
                    { item: 'Giá đỗ', amount: 'handful' },
                    { item: 'Dưa leo', amount: '½, julienned' },
                    { item: 'Cà rốt đồ chua (pickled carrot & daikon)', amount: '3 tbsp' },
                    { item: 'Rau thơm (mint, perilla)', amount: 'handful' },
                ],
            },
            {
                group: 'Marinade & Sauce',
                items: [
                    { item: 'Nước mắm', amount: '3 tbsp' },
                    { item: 'Đường', amount: '2 tbsp' },
                    { item: 'Sả băm', amount: '2 tsp' },
                    { item: 'Tỏi băm', amount: '1 tsp' },
                    { item: 'Dầu mè (sesame oil)', amount: '1 tsp' },
                    { item: 'Nước chấm (dipping sauce)', amount: '4 tbsp prepared' },
                ],
            },
        ],
        steps: [
            'Combine fish sauce, sugar, lemongrass, garlic, and sesame oil. Marinate pork slices 20 min.',
            'Grill pork on high heat 2–3 min per side until caramelised. Fry or air-fry chả giò until crisp.',
            'Blanch bún 1 min, drain and rinse with cold water.',
            'Assemble bowl: vermicelli on the bottom, then lettuce, herbs, bean sprouts, pickled veg, cucumber.',
            'Arrange pork and chả giò on top. Drizzle with nước chấm (fish sauce, sugar, lime, chilli, garlic).',
        ],
    },

    'mi-quang-ga': {
        name: 'Mì Quảng gà',
        prepTime: '15 min',
        cookTime: '30 min',
        tip: 'The distinctive yellow colour comes from turmeric. Mì Quảng is served nearly dry — use just enough broth to moisten, not soup-style.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Ức gà (chicken breast) or thịt gà', amount: '200 g, sliced' },
                    { item: 'Tôm (shrimp)', amount: '6–8 medium' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Mì Quảng (wide turmeric rice noodles)', amount: '150 g' },
                    { item: 'Bánh tráng nướng (grilled rice crackers)', amount: '2 sheets' },
                ],
            },
            {
                group: 'Broth Base',
                items: [
                    { item: 'Nước gà (chicken stock)', amount: '400 mL' },
                    { item: 'Hành tây (onion)', amount: '½, diced' },
                    { item: 'Nghệ tươi (fresh turmeric) or powder', amount: '1 tsp' },
                    { item: 'Dầu ăn', amount: '1 tbsp' },
                    { item: 'Nước mắm, muối', amount: 'to taste' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Giá đỗ, húng quế, ngò', amount: 'handful each' },
                    { item: 'Đậu phộng rang (roasted peanuts)', amount: '2 tbsp' },
                    { item: 'Hành lá', amount: '2 stalks' },
                    { item: 'Ớt, chanh', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Sauté onion in oil with turmeric until fragrant. Add chicken and shrimp, cook 3–4 min.',
            'Add chicken stock; simmer 15 min. Season with fish sauce and salt.',
            'Blanch mì Quảng noodles briefly (1 min), drain.',
            'Place noodles in bowl; ladle a small amount of broth and toppings over (just enough to coat, not drown).',
            'Top with peanuts, spring onion, herbs. Serve with rice crackers on the side to crumble over.',
        ],
    },

    'com-ga-hoi-an': {
        name: 'Cơm gà Hội An',
        prepTime: '15 min',
        cookTime: '40 min',
        tip: 'The signature is cooking rice in the chicken broth (plus turmeric for yellow colour). Use a whole chicken leg for best flavour and shred the meat finely.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Đùi gà (chicken leg/thigh)', amount: '300 g (or ½ small chicken)' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo Jasmine', amount: '150 g dry' },
                ],
            },
            {
                group: 'Broth & Aromatics',
                items: [
                    { item: 'Gừng (ginger)', amount: '1 knob, smashed' },
                    { item: 'Hành tây (onion)', amount: '½' },
                    { item: 'Nghệ bột (turmeric powder)', amount: '½ tsp' },
                    { item: 'Nước mắm, muối', amount: 'to taste' },
                ],
            },
            {
                group: 'Toppings & Sauce',
                items: [
                    { item: 'Hành phi (crispy fried shallots)', amount: '2 tbsp' },
                    { item: 'Ngò, hành lá', amount: 'handful' },
                    { item: 'Dầu hành (scallion oil)', amount: '2 tbsp' },
                    { item: 'Nước chấm gừng (ginger dipping sauce)', amount: '3 tbsp' },
                    { item: 'Ớt tương (chilli sauce)', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Simmer chicken in water with ginger and onion 25–30 min until cooked. Remove and cool slightly.',
            'Reserve broth. Measure broth to cook rice (replace water with broth). Add turmeric, cook rice.',
            'Shred chicken finely by hand. Toss with scallion oil, salt, and crispy shallots.',
            'Fluff rice. Serve rice topped with shredded chicken, scallion oil, fresh herbs.',
            'Serve with ginger dipping sauce: ginger-garlic purée + fish sauce + lime + sugar.',
        ],
    },

    'bun-cha-ha-noi': {
        name: 'Bún chả Hà Nội',
        prepTime: '20 min',
        cookTime: '20 min',
        tip: 'Patties (chả viên) should have a small amount of fat for juiciness — use 80/20 pork mince. Serve broth warm, not piping hot; the sweetness mellows at serving temperature.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt ba chỉ (pork belly slices)', amount: '150 g, thinly sliced' },
                    { item: 'Thịt heo xay (ground pork)', amount: '120 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún bò (medium rice vermicelli)', amount: '150 g' },
                ],
            },
            {
                group: 'Dipping Broth',
                items: [
                    { item: 'Nước mắm', amount: '4 tbsp' },
                    { item: 'Giấm (rice vinegar)', amount: '2 tbsp' },
                    { item: 'Đường', amount: '3 tbsp' },
                    { item: 'Nước ấm', amount: '200 mL' },
                    { item: 'Tỏi, ớt, đu đủ xanh cắt lát', amount: 'as garnish in broth' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Xà lách, tía tô, kinh giới, húng', amount: 'large mixed herb plate' },
                    { item: 'Tỏi băm, ớt', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Mix ground pork with salt, pepper, fish sauce, and sugar to form small patties (chả viên).',
            'Marinate sliced pork belly in fish sauce, sugar, garlic for 15 min.',
            'Grill both chả viên and belly slices over charcoal or grill pan until charred.',
            'Prepare dipping broth: mix warm water, fish sauce, vinegar, sugar until sugar dissolves. Add sliced garlic, chilli, and green papaya.',
            'Blanch bún, arrange in a basket. Lay herb plate alongside.',
            'Serve: dip noodles and herbs into the warm broth bowl containing the grilled pork.',
        ],
    },

    'com-rang-thit-bo': {
        name: 'Cơm rang thịt bò',
        prepTime: '10 min',
        cookTime: '15 min',
        tip: 'Day-old refrigerated rice fries much better than fresh — it is drier and grains separate easily. High heat throughout is essential; do not crowd the pan.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò thăn (beef sirloin or flank)', amount: '150 g, thin strips' },
                    { item: 'Trứng gà', amount: '2 eggs' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Cơm nguội / cơm để qua đêm (cooked rice, cold)', amount: '300 g (≈ 150 g dry)' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Cà rốt (carrot), diced', amount: '½ medium' },
                    { item: 'Đậu Hà Lan (frozen peas)', amount: '3 tbsp' },
                    { item: 'Hành tây (onion), diced', amount: '½ small' },
                    { item: 'Hành lá', amount: '3 stalks' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Nước tương (soy sauce)', amount: '2 tbsp' },
                    { item: 'Nước mắm', amount: '1 tbsp' },
                    { item: 'Dầu hào', amount: '1 tbsp' },
                    { item: 'Tiêu, muối', amount: 'to taste' },
                    { item: 'Dầu ăn', amount: '3 tbsp' },
                ],
            },
        ],
        steps: [
            'Marinate beef strips in soy sauce and oyster sauce for 10 min.',
            'Heat wok on very high. Stir-fry beef quickly 1–2 min until just cooked; set aside.',
            'Add more oil; scramble eggs and set aside. Sauté onion until translucent.',
            'Add carrot and peas, stir-fry 2 min. Push to side.',
            'Add cold rice; break up clumps. Toss everything together on high heat 3–4 min.',
            'Add beef back in. Season with fish sauce, salt, pepper. Finish with spring onion.',
        ],
    },

    'chao-suon-heo': {
        name: 'Cháo sườn heo',
        prepTime: '10 min',
        cookTime: '45 min',
        tip: 'Use a 1:8 rice-to-water ratio for creamy congee. Breaking the rice grains slightly before cooking (pulse in blender 5 sec) speeds up the process.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Sườn heo chặt khúc (pork ribs, chopped)', amount: '300 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo tẻ', amount: '80 g (dry)' },
                ],
            },
            {
                group: 'Aromatics',
                items: [
                    { item: 'Gừng (ginger)', amount: '3 slices' },
                    { item: 'Hành tím (shallot)', amount: '2, halved' },
                    { item: 'Hành lá, ngò', amount: 'garnish' },
                    { item: 'Hành phi crispy', amount: '1 tbsp garnish' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Nước mắm', amount: '2 tbsp' },
                    { item: 'Hạt nêm', amount: '1 tsp' },
                    { item: 'Muối, tiêu trắng (white pepper)', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blanch ribs in boiling water 5 min, rinse clean.',
            'In fresh water (1.5 L), simmer ribs with ginger and shallot 30 min.',
            'Add rinsed rice; simmer stirring occasionally 20–25 min until grains break down into thick porridge.',
            'Season with fish sauce, seasoning powder, and white pepper.',
            'Serve in bowls topped with spring onion, cilantro, and crispy shallots.',
        ],
    },

    'bun-hai-san': {
        name: 'Bún hải sản',
        prepTime: '15 min',
        cookTime: '25 min',
        tip: 'Do not overcook seafood — add shrimp and squid last and simmer only 2–3 min. Fish can be added a few minutes earlier.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Tôm (shrimp)', amount: '100 g, peeled & deveined' },
                    { item: 'Mực (squid), rings', amount: '80 g' },
                    { item: 'Cá phi lê (white fish fillet)', amount: '80 g, cubed' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún tươi (rice vermicelli)', amount: '150 g' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Nước dùng (seafood or chicken stock)', amount: '700 mL' },
                    { item: 'Cà chua (tomato), wedges', amount: '2 medium' },
                    { item: 'Hành tím, tỏi', amount: '2 shallots, 3 garlic cloves' },
                    { item: 'Sả (lemongrass)', amount: '2 stalks, smashed' },
                ],
            },
            {
                group: 'Seasoning & Garnish',
                items: [
                    { item: 'Nước mắm, muối', amount: 'to taste' },
                    { item: 'Hành lá, ngò, thìa là (dill)', amount: 'handful' },
                    { item: 'Ớt, chanh', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Sauté shallots and garlic in oil until fragrant. Add tomato wedges; cook until softened.',
            'Add stock and lemongrass; bring to boil. Simmer 10 min.',
            'Add fish cubes first; simmer 3 min. Add squid rings and shrimp; cook 2–3 min until pink and opaque.',
            'Season with fish sauce and salt. Remove lemongrass.',
            'Blanch bún 1 min. Serve noodles in bowls, ladle broth and seafood over. Top with dill, spring onion, and herbs.',
        ],
    },

    'com-ca-basa-kho-to': {
        name: 'Cơm cá basa kho tộ',
        prepTime: '10 min',
        cookTime: '30 min',
        tip: 'Use a clay pot (nồi đất) if available — it distributes heat evenly and gives the caramel a deep flavour. If not, a thick-bottomed saucepan works.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Cá basa (basa/catfish fillet)', amount: '250 g, cut into chunks' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo (rice)', amount: '150 g dry' },
                ],
            },
            {
                group: 'Braising Sauce',
                items: [
                    { item: 'Nước dừa (coconut water)', amount: '150 mL' },
                    { item: 'Nước màu đường (caramel sauce)', amount: '2 tbsp (or 1 tbsp sugar + heat)' },
                    { item: 'Nước mắm', amount: '2 tbsp' },
                    { item: 'Tỏi băm', amount: '2 cloves' },
                    { item: 'Ớt tươi', amount: '1–2 sliced' },
                    { item: 'Tiêu', amount: '½ tsp' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Hành lá', amount: '2 stalks' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Marinate fish with fish sauce, pepper, garlic for 10 min.',
            'Make caramel: melt sugar in pot until golden brown. Carefully add coconut water (it will spit).',
            'Add fish to the caramel sauce. Cook uncovered on medium-low heat 15–20 min, turning once gently.',
            'Sauce should thicken and coat the fish. Adjust salt with fish sauce.',
            'Serve fish over rice; top with sliced chilli and spring onion.',
        ],
    },

    'banh-mi-thit-heo-nuong': {
        name: 'Bánh mì thịt heo nướng',
        prepTime: '20 min',
        cookTime: '15 min',
        tip: 'The bread should be crusty on the outside and airy inside — a Vietnamese baguette is lighter than French. Warm the bánh mì in the oven or grill briefly before assembling.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt heo cổ (pork collar/neck)', amount: '180 g, thin slices' },
                    { item: 'Pâté heo (pork liver pâté)', amount: '2 tbsp' },
                    { item: 'Chả lụa', amount: '60 g, sliced' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bánh mì Việt Nam (Vietnamese baguette)', amount: '1 long roll (~100 g)' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Dưa leo (cucumber), julienned', amount: '½' },
                    { item: 'Cà rốt & củ cải đồ chua (pickled carrot & daikon)', amount: '4 tbsp' },
                    { item: 'Ngò (cilantro)', amount: 'handful' },
                    { item: 'Ớt jalapeño or ớt tươi', amount: 'slices to taste' },
                ],
            },
            {
                group: 'Marinade & Condiments',
                items: [
                    { item: 'Nước mắm, đường, tỏi, sả', amount: '1 tbsp each for marinade' },
                    { item: 'Mayonnaise (Kewpie)', amount: '1 tbsp' },
                    { item: 'Nước tương', amount: '1 tsp' },
                ],
            },
        ],
        steps: [
            'Mix marinade (fish sauce, sugar, garlic, lemongrass). Coat pork; rest 15 min.',
            'Grill pork over high heat 3–4 min each side until caramelised.',
            'Make pickled veg: julienned carrot and daikon in equal parts vinegar, sugar, salt; rest 15+ min.',
            'Warm bread. Slice along one side. Spread pâté and mayo inside.',
            'Layer in chả lụa, grilled pork, cucumber, pickled veg, cilantro, and chilli.',
        ],
    },

    'bun-rieu-cua-dong': {
        name: 'Bún riêu cua đồng',
        prepTime: '15 min',
        cookTime: '30 min',
        tip: 'Blending and straining the crab creates the signature stock. The crab paste (riêu) rises to the surface — skim and set aside before adding other ingredients so it stays in clumps.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Cua đồng (field crabs) or gạch cua paste', amount: '200 g fresh / 100 g paste' },
                    { item: 'Tôm khô (dried shrimp)', amount: '30 g' },
                    { item: 'Đậu hũ chiên (fried tofu)', amount: '2 pieces' },
                    { item: 'Chả cua or chả lụa', amount: '80 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún tươi', amount: '150 g' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Cà chua (tomato), wedges', amount: '3 medium' },
                    { item: 'Mắm tôm (shrimp paste)', amount: '1 tsp' },
                    { item: 'Nước mắm, muối', amount: 'to taste' },
                    { item: 'Dầu điều (annatto oil)', amount: '1 tbsp' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Rau muống, giá, bắp chuối bào', amount: 'mixed plate' },
                    { item: 'Hành lá, ngò gai', amount: 'handful' },
                    { item: 'Ớt, chanh', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blend crabs with water, strain through sieve to extract crab stock. Set paste aside.',
            'Bring stock to boil; crab paste will coagulate — carefully skim off and set aside.',
            'Sauté tomato in annatto oil until softened; add to broth.',
            'Rehydrate dried shrimp in warm water 10 min; add to broth.',
            'Season with fish sauce, shrimp paste, and salt.',
            'Blanch bún. Bowl up noodles, ladle broth over. Add tofu, chả, and crab paste clumps.',
            'Serve with raw vegetable plate and mắm tôm on the side.',
        ],
    },

    'hu-tieu-nam-vang': {
        name: 'Hủ tiếu Nam Vang',
        prepTime: '15 min',
        cookTime: '40 min',
        tip: 'The broth should be sweet and clear — use pork bones and dried squid for depth. Hủ tiếu can be served khô (dry) or nước (soup); this recipe is the soup version.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt heo thái lát (pork slices)', amount: '100 g, blanched' },
                    { item: 'Tôm (shrimp)', amount: '8 medium, peeled' },
                    { item: 'Gan heo (pork liver)', amount: '60 g, thinly sliced' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Hủ tiếu (dried tapioca noodles or fresh)', amount: '150 g' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Xương heo (pork bones)', amount: '400 g' },
                    { item: 'Mực khô (dried squid)', amount: '1 small piece' },
                    { item: 'Củ cải trắng (daikon)', amount: '100 g' },
                    { item: 'Nước mắm, muối, đường', amount: 'to taste' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Giá đỗ, hẹ (garlic chives)', amount: 'handful' },
                    { item: 'Tỏi phi, hành phi', amount: '1 tbsp each' },
                    { item: 'Ngò, ớt, chanh', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Blanch pork bones; simmer with daikon and dried squid 40 min for sweet, clear broth. Season.',
            'Soak dried hủ tiếu 30 min; blanch 1 min. (Fresh: blanch 30 sec.)',
            'Blanch shrimp and liver separately in boiling broth until just cooked.',
            'Blanch pork slices. Arrange noodles, pork, shrimp, and liver in bowl.',
            'Ladle hot broth over. Top with crispy garlic, crispy shallots, spring onion.',
            'Serve with bean sprouts, chives, lime, and chilli on the side.',
        ],
    },

    // ── SNACK ─────────────────────────────────────────────────────

    'whey-shake-chuoi': {
        name: 'Whey shake + Chuối',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'For best texture, blend frozen banana rather than fresh. Consume within 30 min post-workout while the anabolic window is open.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Whey protein powder (any flavour)', amount: '1 scoop (~30 g)' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Chuối (banana)', amount: '1 medium (~100 g)' },
                ],
            },
            {
                group: 'Liquid',
                items: [
                    { item: 'Sữa tươi or nước lọc', amount: '200–250 mL' },
                    { item: 'Đá (ice)', amount: 'handful (optional)' },
                ],
            },
        ],
        steps: [
            'Add milk/water to blender. Add whey powder and banana.',
            'Blend 20–30 seconds until smooth.',
            'Add ice and blend briefly if you prefer it cold and frothy.',
            'Drink immediately.',
        ],
    },

    'trung-luoc-sua-chua': {
        name: '3 Trứng luộc + Sữa chua Hy Lạp',
        prepTime: '2 min',
        cookTime: '10 min',
        tip: 'For consistent soft-boiled eggs: start in cold water, bring to boil, cook 9–10 min for fully set yolks, then ice bath immediately to stop cooking and make peeling easy.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Trứng gà (eggs)', amount: '3 large' },
                    { item: 'Sữa chua Hy Lạp không đường (Greek yoghurt, plain)', amount: '150 g' },
                ],
            },
            {
                group: 'Optional',
                items: [
                    { item: 'Mật ong (honey)', amount: '1 tsp (optional sweetener)' },
                    { item: 'Muối, tiêu', amount: 'for eggs' },
                ],
            },
        ],
        steps: [
            'Place eggs in cold water in a pot. Bring to boil over medium heat.',
            'Once boiling, cook 9–10 min for hard-boiled. Transfer to ice water immediately.',
            'Peel eggs; season with salt and pepper.',
            'Serve alongside Greek yoghurt. Drizzle honey over yoghurt if desired.',
        ],
    },

    'banh-mi-trung-op-la': {
        name: 'Bánh mì trứng ốp la',
        prepTime: '3 min',
        cookTime: '8 min',
        tip: 'For runny yolks (ốp la): low-medium heat, cover the pan the last 1 min to steam-set the white. A little soy sauce and fried shallots elevate this simple dish.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Trứng gà', amount: '2 eggs' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bánh mì Việt Nam', amount: '1 small roll (~80 g)' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Dầu ăn or bơ', amount: '1 tbsp' },
                    { item: 'Nước tương nhạt (light soy sauce)', amount: '1 tsp' },
                    { item: 'Hành phi', amount: '1 tbsp' },
                    { item: 'Ớt tươi', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Heat oil/butter in non-stick pan on medium-low.',
            'Crack eggs in; cover with lid. Cook 3–4 min until whites are set, yolks still soft.',
            'Drizzle soy sauce over eggs while still in pan.',
            'Toast or warm bánh mì. Serve eggs on the side with bread and fresh chilli.',
        ],
    },

    'sua-dau-nanh-trung-luoc': {
        name: 'Sữa đậu nành nóng + 2 Trứng luộc',
        prepTime: '2 min',
        cookTime: '10 min',
        tip: 'Vietnamese soy milk (sữa đậu nành) at the market is often unsweetened or lightly sweetened — go for the plain version to avoid excess sugar. Add a pinch of salt to bring out the flavour.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Trứng gà', amount: '2 large' },
                    { item: 'Sữa đậu nành không đường (unsweetened soy milk)', amount: '300 mL' },
                ],
            },
            {
                group: 'Optional',
                items: [
                    { item: 'Muối, tiêu (for eggs)', amount: 'to taste' },
                    { item: 'Đường ít (light sugar for soy milk)', amount: '1 tsp if desired' },
                ],
            },
        ],
        steps: [
            'Boil eggs 9–10 min in cold-start water; ice bath and peel.',
            'Heat soy milk gently on stove (do not boil vigorously) until steaming hot.',
            'Season soy milk to taste; serve hot.',
            'Season eggs with salt and pepper. Serve together.',
        ],
    },

    'sinh-to-bo-whey': {
        name: 'Sinh tố bơ + Whey protein',
        prepTime: '5 min',
        cookTime: '0 min',
        tip: 'Use a ripe, dark-skinned avocado — the flesh should yield to gentle pressure. For a creamier texture, freeze avocado chunks beforehand.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Whey protein (vanilla or unflavoured)', amount: '1 scoop (~30 g)' },
                ],
            },
            {
                group: 'Fat & Carbs',
                items: [
                    { item: 'Bơ chín (ripe avocado)', amount: '½ large (~80 g flesh)' },
                    { item: 'Chuối (banana)', amount: '½ (optional, for sweetness)' },
                ],
            },
            {
                group: 'Liquid',
                items: [
                    { item: 'Sữa tươi or nước lọc', amount: '200 mL' },
                    { item: 'Đá (ice)', amount: 'handful' },
                    { item: 'Mật ong', amount: '1 tsp (optional)' },
                ],
            },
        ],
        steps: [
            'Scoop avocado flesh into blender.',
            'Add milk, whey powder, banana (if using), and ice.',
            'Blend until completely smooth (~30 sec).',
            'Taste and adjust sweetness with honey if needed. Drink immediately.',
        ],
    },

    'protein-bar-sua-chua': {
        name: 'Protein bar + Sữa chua không đường',
        prepTime: '1 min',
        cookTime: '0 min',
        tip: 'Choose a protein bar with at least 15–20g protein and under 250 kcal. Pair with plain Greek yoghurt for added casein protein and probiotics.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Protein bar (e.g. Quest, ON, local brand)', amount: '1 bar (~55 g)' },
                    { item: 'Sữa chua không đường (plain yoghurt)', amount: '150 g' },
                ],
            },
        ],
        steps: [
            'No prep needed. Simply pair the bar with a cup of plain yoghurt.',
            'Eat bar first if hungry; yoghurt provides slow-digesting protein.',
        ],
    },

    'dau-phong-rang-trung': {
        name: 'Đậu phộng rang + 2 Trứng luộc',
        prepTime: '2 min',
        cookTime: '10 min',
        tip: 'Buy raw peanuts and dry-roast yourself: medium heat, stir constantly 5–8 min until golden and fragrant. Season with salt immediately. Store roasted nuts in an airtight jar for the week.',
        ingredients: [
            {
                group: 'Protein & Fat',
                items: [
                    { item: 'Đậu phộng rang (roasted peanuts)', amount: '40 g (~3 tbsp)' },
                    { item: 'Trứng gà', amount: '2 large' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Muối, tiêu', amount: 'pinch for eggs' },
                ],
            },
        ],
        steps: [
            'Boil eggs 9–10 min; ice bath, peel, season.',
            'Measure out roasted peanuts.',
            'Eat together as a balanced protein-and-fat snack.',
        ],
    },

    'sua-hat-trung-cuon': {
        name: 'Sữa hạt Vinamilk + Trứng cuộn rau củ',
        prepTime: '8 min',
        cookTime: '5 min',
        tip: 'Use a small non-stick pan for a clean roll. Pour egg thin, add veg, roll from one side while still slightly wet — it finishes cooking from residual heat.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Trứng gà', amount: '2 eggs' },
                    { item: 'Sữa hạt Vinamilk (Vinamilk nut milk)', amount: '250 mL' },
                ],
            },
            {
                group: 'Vegetables (Filling)',
                items: [
                    { item: 'Cà rốt bào sợi (shredded carrot)', amount: '30 g' },
                    { item: 'Hành lá thái nhỏ', amount: '2 stalks' },
                    { item: 'Cải bó xôi (baby spinach, optional)', amount: 'small handful' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Nước mắm or nước tương', amount: '½ tsp' },
                    { item: 'Muối, tiêu', amount: 'pinch' },
                    { item: 'Dầu ăn', amount: '1 tsp' },
                ],
            },
        ],
        steps: [
            'Beat eggs with fish sauce, salt, and pepper.',
            'Heat a small non-stick pan; add minimal oil.',
            'Pour egg mixture; when bottom sets (30 sec), scatter veg over half.',
            'Roll egg over filling gently. Press lightly; cook 1 more min.',
            'Slide onto plate; slice into pieces. Serve with nut milk on the side.',
        ],
    },

    'cha-lua-banh-mi': {
        name: 'Chả lụa + Bánh mì nhỏ',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Buy chả lụa from a trusted market vendor — the genuine version is steamed (not fried) and has a springy, dense texture. Refrigerate and use within 3 days once opened.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Chả lụa (Vietnamese pork roll)', amount: '100 g, thickly sliced' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bánh mì Việt Nam (small)', amount: '1 small roll (~80 g)' },
                ],
            },
            {
                group: 'Condiments',
                items: [
                    { item: 'Nước tương or tương ớt', amount: '1 tsp for dipping' },
                    { item: 'Dưa leo', amount: '½, sliced (optional)' },
                ],
            },
        ],
        steps: [
            'Slice chả lụa into thick rounds.',
            'Warm bánh mì (oven 2 min or grill 1 min for crispness).',
            'Stuff bread with chả lụa and cucumber slices.',
            'Dip in soy sauce or chilli sauce. Eat immediately while bread is warm.',
        ],
    },

    'xoi-ga-xe': {
        name: 'Xôi gà xé (nhỏ)',
        prepTime: '10 min',
        cookTime: '30 min',
        tip: 'Soak glutinous rice 4–8 h before steaming — this is essential for even, soft, non-crunchy results. Shred chicken while warm for easier tearing.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Ức gà (chicken breast)', amount: '150 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo nếp (glutinous rice, soaked 4 h)', amount: '80 g dry' },
                ],
            },
            {
                group: 'Toppings',
                items: [
                    { item: 'Hành phi (crispy shallots)', amount: '2 tbsp' },
                    { item: 'Hành lá, ngò', amount: '2 stalks' },
                    { item: 'Dầu hành (scallion oil)', amount: '1 tbsp' },
                    { item: 'Gừng, nước mắm (for poaching liquid)', amount: '1 tsp each' },
                    { item: 'Muối, tiêu, nước mắm', amount: 'to season chicken' },
                ],
            },
        ],
        steps: [
            'Poach chicken breast in water with ginger and fish sauce 20 min; cool and shred by hand.',
            'Season shredded chicken with salt, pepper, scallion oil.',
            'Steam soaked glutinous rice 25–30 min until translucent and cooked through. Season with pinch of salt.',
            'Serve a small portion of xôi topped with shredded chicken, crispy shallots, and spring onion.',
        ],
    },

    // ── DINNER ────────────────────────────────────────────────────

    'thit-kho-trung-com': {
        name: 'Thịt kho trứng + Cơm trắng',
        prepTime: '10 min',
        cookTime: '1 h',
        tip: 'The caramel (nước màu) is the soul of this dish. Cook sugar on dry heat until dark amber before adding liquid — the bitterness of dark caramel balances the sweetness of coconut water.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt ba chỉ (pork belly)', amount: '300 g, 3–4 cm cubes' },
                    { item: 'Trứng vịt or trứng gà (duck or chicken eggs)', amount: '4 hard-boiled, peeled' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo (rice)', amount: '150 g dry' },
                ],
            },
            {
                group: 'Braising Liquid',
                items: [
                    { item: 'Nước dừa (coconut water)', amount: '300 mL' },
                    { item: 'Đường (for caramel)', amount: '2 tbsp' },
                    { item: 'Nước mắm', amount: '3 tbsp' },
                    { item: 'Tỏi, hành tím (garlic, shallot)', amount: '3 cloves, 2 shallots' },
                    { item: 'Tiêu, ớt', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Blanch pork belly 5 min; rinse. Marinate with fish sauce, garlic, shallot, pepper 15 min.',
            'Make caramel: melt sugar in pot over medium heat until dark amber; carefully pour in coconut water.',
            'Add pork to caramel; stir to coat. Add hard-boiled eggs.',
            'Simmer on low heat 45–60 min until pork is tender and sauce thickens. Turn eggs occasionally.',
            'Serve over rice. Traditionally paired with dưa giá (pickled bean sprouts) to cut richness.',
        ],
    },

    'canh-chua-ca-loc-com': {
        name: 'Canh chua cá lóc + Cơm',
        prepTime: '15 min',
        cookTime: '25 min',
        tip: 'Use fresh tamarind pulp (me tươi) rather than tamarind paste for a brighter, more complex sourness. If cá lóc (snakehead fish) is unavailable, any firm white fish works.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Cá lóc (snakehead fish), steaks', amount: '250 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Sour Broth',
                items: [
                    { item: 'Nước me (tamarind water)', amount: '3 tbsp pulp dissolved in 100 mL water' },
                    { item: 'Cà chua', amount: '2 medium, wedges' },
                    { item: 'Thơm / dứa (pineapple)', amount: '100 g, chunks' },
                    { item: 'Đậu bắp (okra)', amount: '4 pods, sliced' },
                    { item: 'Giá đỗ', amount: 'handful' },
                    { item: 'Ngổ (water mimosa) or ngò om', amount: 'handful' },
                    { item: 'Nước mắm, đường, muối', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Bring 700 mL water to boil. Add tamarind water and pineapple; simmer 5 min.',
            'Add tomato and okra; simmer 5 min.',
            'Gently add fish steaks; cook 8–10 min until fish is cooked through.',
            'Add bean sprouts last (30 sec only). Season with fish sauce, sugar, salt.',
            'Garnish with ngổ/ngò om. Serve alongside rice.',
        ],
    },

    'ga-hap-la-chanh-com-gao-lut': {
        name: 'Gà hấp lá chanh + Cơm gạo lứt',
        prepTime: '10 min',
        cookTime: '30 min',
        tip: 'Kaffir lime leaves (lá chanh) are different from regular lime leaves — they have a distinctive figure-8 shape and intense fragrance. Find them at Asian markets.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Đùi gà (chicken thigh/leg)', amount: '300 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo lứt (brown rice)', amount: '150 g dry (cook with more water, longer)' },
                ],
            },
            {
                group: 'Aromatics',
                items: [
                    { item: 'Lá chanh (kaffir lime leaves)', amount: '8–10 leaves' },
                    { item: 'Sả (lemongrass)', amount: '2 stalks, smashed' },
                    { item: 'Gừng', amount: '3 slices' },
                    { item: 'Nước dừa', amount: '100 mL (optional, enhances flavour)' },
                ],
            },
            {
                group: 'Dipping Sauce',
                items: [
                    { item: 'Muối, tiêu, chanh (salt-pepper-lime sauce)', amount: '1 tsp salt + ½ tsp pepper + squeeze of lime' },
                    { item: 'Ớt tươi', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Cook brown rice (1:2 rice-to-water ratio, cook 35–40 min).',
            'Score chicken skin. Stuff kaffir lime leaves and lemongrass under skin and in cavity.',
            'Place chicken in steamer; add ginger slices on top. Steam 25–30 min until juices run clear.',
            'Mix dipping sauce: salt, white pepper, lime juice, and sliced chilli.',
            'Serve chicken with brown rice and dipping sauce. Garnish with extra lime leaves.',
        ],
    },

    'bo-luc-lac-com': {
        name: 'Bò lúc lắc + Cơm trắng',
        prepTime: '15 min',
        cookTime: '10 min',
        tip: 'The "lúc lắc" (shake-shake) technique: flash-sear in small batches on very high heat, tossing the pan rapidly. Never crowd — steam kills the char. Serve immediately.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò thăn (beef sirloin or tenderloin)', amount: '250 g, 2 cm cubes' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Cà chua, dưa leo (tomato, cucumber)', amount: '1 each, sliced for salad bed' },
                    { item: 'Hành tây (red onion)', amount: '½, thinly sliced' },
                    { item: 'Rau xà lách', amount: 'handful' },
                ],
            },
            {
                group: 'Marinade & Sauce',
                items: [
                    { item: 'Nước tương', amount: '2 tbsp' },
                    { item: 'Dầu hào', amount: '1 tbsp' },
                    { item: 'Đường', amount: '1 tsp' },
                    { item: 'Tỏi băm', amount: '2 cloves' },
                    { item: 'Tiêu đen', amount: '½ tsp' },
                    { item: 'Bơ (butter)', amount: '1 tbsp' },
                    { item: 'Muối ớt chanh (salt-chilli-lime mix)', amount: 'for dipping' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Cube beef and marinate in soy sauce, oyster sauce, sugar, garlic, pepper for 15 min.',
            'Arrange salad bed (lettuce, tomato, cucumber, red onion) on serving plate.',
            'Heat wok until smoking. Add butter and sear beef in small batches 1–2 min, tossing vigorously.',
            'Spoon seared beef over salad. Serve alongside rice.',
            'Dip beef in salt-chilli-lime mix.',
        ],
    },

    'tom-rang-muoi-com': {
        name: 'Tôm rang muối + Cơm gạo lứt',
        prepTime: '10 min',
        cookTime: '15 min',
        tip: 'Leave the shells on — they get crispy and add enormous flavour. Devein but keep shells. Very high heat is non-negotiable for the dry, fragrant finish.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Tôm cỡ vừa (medium shrimp), shells on', amount: '250 g, deveined' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo lứt', amount: '150 g dry' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Tỏi băm', amount: '4 cloves' },
                    { item: 'Ớt xanh/đỏ (green/red chilli)', amount: '2–3, sliced' },
                    { item: 'Muối hạt (coarse salt)', amount: '1 tsp' },
                    { item: 'Đường', amount: '½ tsp' },
                    { item: 'Tiêu đen', amount: '1 tsp' },
                    { item: 'Dầu ăn', amount: '2 tbsp' },
                    { item: 'Hành lá, chanh', amount: 'garnish' },
                ],
            },
        ],
        steps: [
            'Cook brown rice.',
            'Pat shrimp completely dry with paper towels.',
            'Heat oil in wok on very high heat until nearly smoking.',
            'Add garlic and chilli; stir 30 sec. Add shrimp in single layer.',
            'Sear without stirring 1 min; flip and cook 1 more min. Toss with coarse salt, sugar, and pepper.',
            'Remove from heat; toss with spring onion. Serve with rice and lime wedges.',
        ],
    },

    'ca-kho-to-com': {
        name: 'Cá kho tộ + Cơm trắng',
        prepTime: '10 min',
        cookTime: '35 min',
        tip: 'Cá kho tộ improves with time — make a bigger batch and reheat next day. The caramelised glaze intensifies after resting overnight.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Cá basa or cá lóc, steaks', amount: '250 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Braising Sauce',
                items: [
                    { item: 'Đường (caramel)', amount: '2 tbsp' },
                    { item: 'Nước mắm', amount: '3 tbsp' },
                    { item: 'Nước dừa', amount: '150 mL' },
                    { item: 'Tỏi, ớt', amount: '3 cloves, 2 chillies' },
                    { item: 'Tiêu', amount: '½ tsp' },
                    { item: 'Gừng (ginger slices)', amount: '3 slices' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Marinate fish with fish sauce, garlic, pepper for 10 min.',
            'Make caramel: sugar until dark amber; add coconut water carefully.',
            'Add fish to caramel; do not stir (fish breaks easily). Add ginger and chilli.',
            'Simmer on low heat 25–30 min, spooning sauce over fish occasionally.',
            'Sauce should be thick and glossy. Serve over rice.',
        ],
    },

    'lau-thap-cam': {
        name: 'Lẩu thập cẩm (1 phần)',
        prepTime: '20 min',
        cookTime: '20 min',
        tip: 'For a solo hotpot, use a small tabletop burner and a single-person pot. Have all ingredients prepped and arranged before lighting — hotpot is fast once the broth is boiling.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò thái lát', amount: '80 g' },
                    { item: 'Tôm', amount: '5–6 medium' },
                    { item: 'Cá viên (fish balls)', amount: '4 pieces' },
                    { item: 'Mực', amount: '60 g, rings' },
                    { item: 'Đậu hũ', amount: '1 block, cubed' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bún or mì (noodles of choice)', amount: '100 g' },
                ],
            },
            {
                group: 'Broth',
                items: [
                    { item: 'Nước dùng gà or lẩu gia vị (ready-made hotpot base)', amount: '800 mL' },
                    { item: 'Sả, gừng, ớt', amount: 'for broth' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Rau muống, cải thảo, nấm', amount: 'mixed plate' },
                    { item: 'Cà chua, ngô (corn on cob), mọc nhĩ', amount: 'as desired' },
                ],
            },
            {
                group: 'Dipping Sauce',
                items: [
                    { item: 'Tương hoisin + tương ớt (mù tạt sauce)', amount: '3 tbsp hoisin + chilli' },
                    { item: 'Chanh, ớt', amount: 'to taste' },
                ],
            },
        ],
        steps: [
            'Prepare broth: simmer stock with lemongrass, ginger, and chilli 15 min.',
            'Arrange all proteins, vegetables, and noodles on plates around the pot.',
            'Bring broth to rolling boil at the table.',
            'Cook ingredients in order of density: corn and tough veg first, then proteins, then noodles and greens.',
            'Dip cooked pieces into hoisin-chilli sauce.',
        ],
    },

    'suon-ham-hat-sen-com': {
        name: 'Sườn hầm hạt sen + Cơm',
        prepTime: '10 min',
        cookTime: '1 h',
        tip: 'Dried lotus seeds need soaking 2 hours before cooking, or use fresh/canned lotus seeds to save time. This dish is best cooked low and slow — pressure cooker halves the time.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Sườn heo (pork ribs)', amount: '300 g, chopped' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                    { item: 'Hạt sen (lotus seeds, soaked)', amount: '60 g' },
                ],
            },
            {
                group: 'Broth & Aromatics',
                items: [
                    { item: 'Nước dùng heo (pork stock)', amount: '600 mL' },
                    { item: 'Hành tây', amount: '½, quartered' },
                    { item: 'Gừng', amount: '3 slices' },
                    { item: 'Nước mắm, hạt nêm, muối', amount: 'to taste' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Hành lá, ngò', amount: 'to garnish' },
                    { item: 'Tiêu trắng', amount: 'pinch' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Blanch ribs 5 min; rinse.',
            'In pot, simmer ribs in stock with ginger and onion 30 min.',
            'Add lotus seeds (drained); simmer 20–30 min more until seeds and ribs are tender.',
            'Season with fish sauce, seasoning powder, salt.',
            'Serve soup alongside rice, garnished with spring onion and white pepper.',
        ],
    },

    'dau-phu-nhoi-thit-sot-ca-chua': {
        name: 'Đậu phụ nhồi thịt sốt cà chua + Cơm',
        prepTime: '15 min',
        cookTime: '20 min',
        tip: 'Firm tofu (đậu phụ cứng) holds its shape better than soft. Hollow out each piece with a small spoon and keep the removed tofu to mix into the meat filling — wastes nothing.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Đậu phụ cứng (firm tofu)', amount: '4 squares (200 g)' },
                    { item: 'Thịt heo xay (ground pork)', amount: '150 g' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Tomato Sauce',
                items: [
                    { item: 'Cà chua (tomato)', amount: '3 medium, chopped' },
                    { item: 'Tỏi băm', amount: '3 cloves' },
                    { item: 'Hành tím', amount: '2, diced' },
                    { item: 'Nước tương, nước mắm', amount: '1 tbsp each' },
                    { item: 'Đường', amount: '½ tsp' },
                    { item: 'Dầu ăn', amount: '2 tbsp' },
                ],
            },
            {
                group: 'Garnish',
                items: [
                    { item: 'Hành lá, ngò', amount: 'handful' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Hollow out tofu squares; mix removed tofu into ground pork. Season pork with fish sauce, pepper, garlic.',
            'Stuff pork mixture into tofu cavities. Pan-fry stuffed tofu in oil 3 min per side until golden.',
            'Sauté shallot and garlic; add tomato and cook until sauce forms (5 min). Season with soy sauce, fish sauce, sugar.',
            'Place fried tofu in sauce; simmer 5–8 min until pork is cooked through.',
            'Serve over rice, topped with spring onion and cilantro.',
        ],
    },

    'ga-rang-gung-com': {
        name: 'Gà rang gừng + Cơm trắng',
        prepTime: '10 min',
        cookTime: '20 min',
        tip: 'Fresh ginger gives a brighter heat; use more than you think necessary — the flavour mellows during cooking. Bone-in chicken pieces retain more moisture than breast alone.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Gà chặt miếng (chicken pieces)', amount: '400 g (mix of thigh and drumstick)' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Gừng tươi (fresh ginger), julienned', amount: '40 g (thumb-sized piece)' },
                    { item: 'Tỏi băm', amount: '4 cloves' },
                    { item: 'Hành tím', amount: '3, sliced' },
                    { item: 'Nước mắm', amount: '2 tbsp' },
                    { item: 'Nước tương', amount: '1 tbsp' },
                    { item: 'Đường', amount: '1 tsp' },
                    { item: 'Tiêu, ớt', amount: 'to taste' },
                    { item: 'Dầu ăn', amount: '2 tbsp' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Marinate chicken with fish sauce, soy sauce, pepper, half the garlic for 15 min.',
            'Heat oil on high; sear chicken pieces skin-side down 4–5 min until golden.',
            'Flip; add remaining garlic, shallot, and ginger. Stir-fry together 5 min.',
            'Add sugar; toss to caramelise. Add a splash of water if needed to deglaze.',
            'Cook until chicken is fully done and sauce coats pieces. Serve over rice.',
        ],
    },

    'uc-ga-hap-bong-cai-trung': {
        name: 'Ức gà hấp + Bông cải xanh + Trứng luộc',
        prepTime: '5 min',
        cookTime: '25 min',
        tip: 'Avoid overcooking — chicken breast is done at 75°C internal temperature. Remove from steamer promptly. Broccoli should be bright green and still have slight crunch.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Ức gà (chicken breast)', amount: '200 g' },
                    { item: 'Trứng gà', amount: '2 hard-boiled' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Bông cải xanh (broccoli)', amount: '200 g, florets' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Muối, tiêu', amount: 'to taste' },
                    { item: 'Gừng (for steaming liquid)', amount: '3 slices' },
                    { item: 'Nước tương or muối-chanh (dipping)', amount: '1 tbsp' },
                ],
            },
        ],
        steps: [
            'Season chicken breast with salt and pepper.',
            'Place ginger slices under chicken; steam 20–22 min until cooked through (juices run clear).',
            'Boil eggs 9–10 min; ice bath, peel.',
            'Steam or blanch broccoli 3–4 min until bright green and tender-crisp.',
            'Slice chicken. Plate with broccoli and halved eggs. Serve with soy sauce or salt-lime dip.',
        ],
    },

    'ca-hoi-ap-chao-rau-cu': {
        name: 'Cá hồi áp chảo + Rau củ hấp',
        prepTime: '5 min',
        cookTime: '15 min',
        tip: 'Pat salmon completely dry before searing — moisture is the enemy of a good crust. Start skin-side down on high heat, then reduce to medium and flip only once.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Cá hồi (salmon fillet, skin on)', amount: '180 g' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Bông cải xanh (broccoli)', amount: '150 g, florets' },
                    { item: 'Cà rốt', amount: '1 small, sliced' },
                    { item: 'Đậu Hà Lan (snap peas)', amount: '50 g' },
                ],
            },
            {
                group: 'Seasoning',
                items: [
                    { item: 'Muối, tiêu', amount: 'generous pinch' },
                    { item: 'Dầu ô liu or dầu ăn', amount: '1 tbsp' },
                    { item: 'Bơ (butter)', amount: '1 tbsp (optional finish)' },
                    { item: 'Chanh, tỏi (lemon, garlic)', amount: 'squeeze + 1 clove' },
                    { item: 'Nước tương or tương miso', amount: '1 tsp glaze (optional)' },
                ],
            },
        ],
        steps: [
            'Pat salmon dry; season both sides with salt and pepper.',
            'Heat pan to high. Add oil; sear salmon skin-side down 4–5 min without moving.',
            'Flip; reduce to medium. Add butter and garlic; baste 2–3 min until flesh is opaque and flaky.',
            'Steam mixed vegetables 5–6 min until tender-crisp.',
            'Plate salmon over vegetables; squeeze lemon over. Serve immediately.',
        ],
    },

    'muc-xao-can-tay-com': {
        name: 'Mực xào cần tây + Cơm gạo lứt',
        prepTime: '10 min',
        cookTime: '10 min',
        tip: 'Score squid in a crosshatch pattern before cutting into pieces — this helps it curl attractively during cooking and cook evenly. High heat, short time; overcooked squid is rubbery.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Mực ống (squid), cleaned', amount: '200 g, scored & cut into pieces' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo lứt', amount: '150 g dry' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Cần tây (celery), diagonally sliced', amount: '3 stalks' },
                    { item: 'Ớt đỏ (red bell pepper), strips', amount: '½ pepper' },
                    { item: 'Tỏi, gừng', amount: '3 cloves, 3 slices' },
                    { item: 'Hành tây', amount: '½, sliced' },
                ],
            },
            {
                group: 'Sauce',
                items: [
                    { item: 'Nước tương', amount: '2 tbsp' },
                    { item: 'Dầu hào', amount: '1 tbsp' },
                    { item: 'Nước mắm', amount: '1 tsp' },
                    { item: 'Tiêu, muối', amount: 'to taste' },
                    { item: 'Dầu mè', amount: '½ tsp (finish)' },
                ],
            },
        ],
        steps: [
            'Cook brown rice.',
            'Score squid and cut into pieces. Marinate with pinch of salt and pepper.',
            'Heat wok on very high. Stir-fry garlic and ginger 30 sec.',
            'Add squid; stir-fry 1–2 min until it curls and turns opaque. Remove squid.',
            'Stir-fry onion, celery, and bell pepper 2 min. Add squid back.',
            'Add soy sauce, oyster sauce, fish sauce; toss to combine. Finish with sesame oil. Serve over brown rice.',
        ],
    },

    'thit-bo-xao-nam-com': {
        name: 'Thịt bò xào nấm + Cơm trắng',
        prepTime: '10 min',
        cookTime: '10 min',
        tip: 'Slice beef against the grain for tenderness. Marinate with a small pinch of baking soda (½ tsp) for 10 min then rinse off — this is the velvet technique restaurants use.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Thịt bò thăn (beef sirloin)', amount: '200 g, thin strips' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Gạo', amount: '150 g dry' },
                ],
            },
            {
                group: 'Vegetables',
                items: [
                    { item: 'Nấm đông cô (shiitake), sliced', amount: '80 g' },
                    { item: 'Nấm bào ngư (oyster mushroom)', amount: '80 g' },
                    { item: 'Hành tây', amount: '½, sliced' },
                    { item: 'Tỏi, gừng', amount: '3 cloves, 2 slices' },
                    { item: 'Hành lá', amount: '3 stalks' },
                ],
            },
            {
                group: 'Marinade & Sauce',
                items: [
                    { item: 'Nước tương', amount: '2 tbsp' },
                    { item: 'Dầu hào', amount: '2 tbsp' },
                    { item: 'Tinh bột bắp (cornstarch)', amount: '1 tsp' },
                    { item: 'Đường', amount: '1 tsp' },
                    { item: 'Dầu mè', amount: '½ tsp' },
                    { item: 'Tiêu', amount: '½ tsp' },
                ],
            },
        ],
        steps: [
            'Cook rice.',
            'Marinate beef: soy sauce, oyster sauce, cornstarch, pepper, sesame oil for 10 min.',
            'Heat wok to very high. Sear beef in single layer 1 min per side; set aside.',
            'Stir-fry garlic and ginger 30 sec. Add mushrooms; cook until slightly golden (3 min).',
            'Add onion; stir-fry 1 min. Add beef back in. Season with remaining soy sauce and oyster sauce.',
            'Finish with spring onion and a drizzle of sesame oil. Serve over rice.',
        ],
    },

    // ── PRE-SLEEP ─────────────────────────────────────────────────

    'casein-shake-sua-tuoi': {
        name: 'Casein shake + Sữa tươi không đường',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Mix casein with slightly warm milk for a smoother consistency — it is thicker than whey and can clump in cold liquid. Consume 30–60 min before bed.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Casein protein powder (chocolate or vanilla)', amount: '1 scoop (~30 g)' },
                    { item: 'Sữa tươi không đường (unsweetened fresh milk)', amount: '200 mL' },
                ],
            },
        ],
        steps: [
            'Warm milk slightly (30 sec microwave or kettle-warm).',
            'Add casein powder to shaker bottle; pour warm milk over.',
            'Shake vigorously 20–30 sec until smooth.',
            'Drink slowly 30–60 min before sleep.',
        ],
    },

    'pho-mai-cottage-hanh-nhan-dau-tay': {
        name: 'Phô mai Cottage + Hạnh nhân + Dâu tây',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Full-fat cottage cheese (phô mai tươi) has more casein and keeps you fuller. Almonds provide slow-digesting fat that further extends satiety through the night.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Phô mai cottage (cottage cheese)', amount: '150 g' },
                ],
            },
            {
                group: 'Fat',
                items: [
                    { item: 'Hạnh nhân (raw or roasted almonds)', amount: '20 g (~15 nuts)' },
                ],
            },
            {
                group: 'Fruit',
                items: [
                    { item: 'Dâu tây (strawberries), halved', amount: '80 g (~6–7 berries)' },
                ],
            },
        ],
        steps: [
            'No cooking needed.',
            'Spoon cottage cheese into bowl.',
            'Top with halved strawberries and almonds.',
            'Eat slowly — this is a pre-sleep snack, not a meal.',
        ],
    },

    'sua-chua-hy-lap-hat-chia': {
        name: 'Sữa chua Hy Lạp + Hạt chia',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Stir chia seeds in and let sit 5 min before eating — they absorb liquid and create a thicker, more satisfying texture. Plain Greek yoghurt (không đường) is ideal; avoid flavoured varieties with added sugar.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Sữa chua Hy Lạp không đường (plain Greek yoghurt)', amount: '200 g' },
                ],
            },
            {
                group: 'Extras',
                items: [
                    { item: 'Hạt chia (chia seeds)', amount: '1 tbsp (~12 g)' },
                    { item: 'Mật ong (optional, for sweetness)', amount: '1 tsp' },
                ],
            },
        ],
        steps: [
            'Spoon Greek yoghurt into bowl.',
            'Stir in chia seeds. Wait 5 min to let seeds hydrate and thicken.',
            'Drizzle honey if desired. Eat before bed.',
        ],
    },

    'sua-hat-casein-shake': {
        name: 'Sữa hạt Vinamilk + Casein shake',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Sữa hạt (nut milk blend) is lighter than dairy milk and pairs well with casein for a less heavy pre-sleep option. Choose unsweetened versions.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Casein protein powder', amount: '1 scoop (~30 g)' },
                    { item: 'Sữa hạt Vinamilk (Vinamilk nut milk, unsweetened)', amount: '250 mL' },
                ],
            },
        ],
        steps: [
            'Add casein powder to shaker; pour nut milk over.',
            'Shake well until fully dissolved.',
            'Drink 30–45 min before sleep.',
        ],
    },

    'pho-mai-tuoi-banh-gao-lut': {
        name: 'Phô mai tươi + Bánh gạo lứt',
        prepTime: '3 min',
        cookTime: '0 min',
        tip: 'Phô mai tươi (fresh cheese) in Vietnam is typically a mild block cheese available at supermarkets (e.g. Bel brand). Brown rice cakes are a light, slow-digesting carb that pairs well with protein before sleep.',
        ingredients: [
            {
                group: 'Protein',
                items: [
                    { item: 'Phô mai tươi (mild block fresh cheese)', amount: '60 g, sliced' },
                ],
            },
            {
                group: 'Carbs',
                items: [
                    { item: 'Bánh gạo lứt (brown rice cakes)', amount: '3–4 crackers (~30 g)' },
                ],
            },
        ],
        steps: [
            'No cooking needed.',
            'Slice cheese into thin pieces.',
            'Layer cheese on rice cakes and eat slowly.',
            'This is a light, mindful wind-down snack — keep portions as listed.',
        ],
    },
};
