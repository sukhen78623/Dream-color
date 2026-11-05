/* ===== DATA ===== */
const P=[
["Wedding","Blush Garden","F8E1E4 F2B8C6 E8D5B7 A9B89A 5F7161","Soft pink with sage for a romantic garden ceremony.","bridal romantic spring floral"],
["Wedding","Ivory & Gold","FBF6EC E9D8A6 C9A24D 8C6A3F 3B2F2F","Warm ivory and gold for a classic evening wedding.","bridal luxury elegant gold"],
["Website","Clean SaaS","F7F9FC 4F6EF7 1E2A5A 22C58B FFB84D","Trustworthy blue with a fresh green accent for product sites.","web ui app brand startup"],
["Website","Creative Studio","111111 F5F1EA FF5A36 7B61FF 2DD4BF","A bold, high-contrast set for portfolios and agencies.","web portfolio ui bold"],
["Minimalist","Quiet Stone","FAFAF8 E6E3DE B8B2AA 6F6A64 24221F","Calm neutrals with soft contrast.","simple neutral clean website"],
["Minimalist","Soft Paper","FFFFFF F1EFEA D9D4CC 9A948B 2B2B2B","Paper-white tones for clean, airy layouts.","simple neutral clean website"],
["Monochromatic","Ocean Blues","E3F0FA B5D6F0 6FA8DC 2F6FA8 12385C","Five steps of one blue, from mist to deep sea.","blue single hue shades"],
["Monochromatic","Plum Tones","F3E8F5 DDB9E3 B070BE 7A3F8A 3E1F4A","Light-to-dark purples that always feel harmonious.","purple single hue shades"],
["Vintage","Retro Diner","F4E3C1 D9A066 C4573B 5B7B7A 2F3E46","Cream, mustard and brick with a teal anchor.","retro classic 70s old"],
["Vintage","Old Postcard","EADBC8 C8A27A 9C6B4E 6F7D6A 3F4A3C","Faded, sun-worn tones with a nostalgic mood.","retro antique sepia old"],
["Modern House","Warm Modern","F2EDE6 D6C7B5 A68B6C 5E6B5A 2A2D2C","Earthy neutrals for living rooms and exteriors.","home interior exterior living bedroom"],
["Modern House","Calm Bedroom","EEF0EC C9D3CB 9FB3A9 7D8B93 3C4650","Muted greens and slate for a restful bedroom.","home interior bedroom relaxing"],
["Pastel","Cotton Candy","FFD6E0 FFEFB5 D4F0C0 BFE3F5 E2D4F5","Light, playful tones for friendly designs.","soft cute light baby"],
["Pastel","Soft Sorbet","FFE5D0 FFD1DC C8F0E0 D6E4FF F3E5FF","Gentle peach, mint and lilac.","soft gentle light spring"],
["Luxury","Midnight Gold","0B0B12 2A2540 6B4C93 C9A24D F5E9C8","Deep night tones lit by gold.","premium elegant dark wedding gold"],
["Luxury","Emerald Estate","07241C 0F5132 B8963E E8DCC0 F7F3EA","Rich emerald with brass and cream.","premium elegant green gold wedding"],
["Nature-Inspired","Forest Floor","2F4B34 5E7F4A A8B97A D7C9A0 8B5E3C","Moss, fern and bark from a woodland walk.","earthy green forest outdoors earth"],
["Nature-Inspired","Coastal Dawn","0E4D64 2A8C9A 8FD0C8 F3E3C3 E7A977","Sea blues meeting warm sand.","earthy ocean beach sunrise"],
["Aesthetic","Dreamy Sunset","2B1B3D 8E3B7A E26D8C FF9E80 FFD8A8","Plum to peach, like the sky after sunset.","sunset warm gradient mood"],
["Aesthetic","Lo-fi Lavender","EFE6F8 CBB8E8 8F7BC4 4D4373 1F1B33","Soft purples for a quiet, cozy vibe.","purple cozy mood night"]
].map(a=>({cat:a[0],name:a[1],cols:a[2].split(" ").map(h=>"#"+h),desc:a[3],tags:a[4]}));

const CD=[
["Coral","#E9694F","A warm pink-orange that feels lively and friendly.","Energy, warmth, friendliness.","Can feel loud or urgent in large amounts.","Warm hues like coral sit at longer visible wavelengths (about 590–700 nm). Meanings people attach to them are cultural, not universal."],
["Ocean Blue","#1F6FB2","A confident mid-blue like deep water under daylight.","Calm, trust, stability.","Can read as cold or distant.","The sky looks blue because air scatters short wavelengths more than long ones (Rayleigh scattering). Blue’s link to trust comes from branding and culture."],
["Sage Green","#9CAF88","A soft grey-green found on herbs and leaves.","Balance, calm, nature.","May feel muted or lifeless.","Human eyes are especially sensitive to greens, which sit near the middle of the visible spectrum. Feelings about green vary by person."],
["Sunflower Yellow","#F5C518","A bright, sunny yellow that draws the eye fast.","Optimism, joy, attention.","Can feel anxious or glaring in excess.","Yellow appears bright because it strongly stimulates both our red- and green-sensitive cones. Its symbolism differs widely across cultures."],
["Royal Purple","#6A3FA0","A deep violet long tied to royalty and creativity.","Creativity, imagination, luxury.","Can feel distant or pretentious.","Purple isn’t a single spectral wavelength; the brain builds it from mixed red and blue light. Its status link comes from costly historical dyes."],
["Blush Pink","#F4B6C2","A gentle pink with a soft, caring feel.","Tenderness, romance, softness.","Can feel overly sweet or stereotyped.","Pink is a tint of red. Its gendered associations are fairly recent and differ by culture."],
["Charcoal","#36454F","A dark slate grey that feels grounded.","Sophistication, seriousness, focus.","Can feel heavy or gloomy.","Dark neutrals give strong contrast against light text, which helps readability. Emotional meanings are shaped by context."],
["Terracotta","#C8654A","A baked-clay orange-brown with earthy warmth.","Groundedness, comfort, craft.","Can feel dusty or dated.","Terracotta’s color comes from iron oxides in clay, an established chemistry. Its cozy feeling is an association, not a measured effect."]
];
const FQ=[
["What is a color palette?","A color palette is a small set of colors chosen to work together in a design, such as a brand, website, room or wedding. Most palettes use three to six colors."],
["How to generate a color palette?","Pick a base color, then build around it using harmonies like complementary, analogous or triadic colors. Dream Color’s Palette Generator does this from one base color."],
["How to choose the best color combinations?","Start with your goal and mood, choose one dominant color, then add a supporting color and a neutral. Check contrast so text stays easy to read."],
["What are the best website color palettes?","Strong website palettes pair a clear primary color with neutrals and one accent for buttons. Try the Website color palettes in our presets for tested starting points."],
["How to create a wedding color palette?","Begin with the season and venue, pick two main colors, then add a neutral like ivory and a metallic or green accent. Browse our wedding palettes for ideas."],
["What is a monochromatic color palette?","A monochromatic palette uses one hue in different tints, tones and shades. It looks harmonious and is easy to get right."],
["How to find HEX color codes?","Use a color picker or the HEX code shown on any palette. A HEX code starts with # and has six characters, like #6D4AFF. Tap a code on Dream Color to copy it."],
["What is the difference between HEX, RGB, and HSL?","They describe the same color differently. HEX is a compact code, RGB gives red, green and blue values from 0 to 255, and HSL uses hue, saturation and lightness, which is easier to adjust by hand."],
["How to extract a color palette from an image?","A color extractor samples the pixels of a photo and groups similar ones to find dominant colors. Dream Color’s Image Picker is built for this."],
["How to create a gradient color combination?","Choose two or more colors that sit close together on the color wheel, set a direction, and preview it. Gradients that pass through very different hues can look muddy."],
["What are the best minimalist color palettes?","Minimalist palettes use mostly neutrals such as off-white, warm grey and charcoal, with at most one accent. See our Minimalist presets."],
["How do I find colors that work well together?","Use the color wheel: analogous colors sit side by side, complementary ones sit opposite. Or start from a ready-made preset that already works."]
];
const EX=["Modern house color palette","Luxury wedding colors","Minimalist website colors","Pastel color combinations","Vintage color palette","Modern bedroom colors","Earthy color palette"];

