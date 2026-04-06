const cloudName = 'do1hlxkk6'
import wc1 from '../assets/Wc1.jpg'
import wc2 from '../assets/Wc2.jpg'
import wc3 from '../assets/Wc3.jpg'
import wc4 from '../assets/Wc4.jpg'
import wc5 from '../assets/Wc5.jpg'
import wc6 from '../assets/Wc6.jpg'
import wc7 from '../assets/Wc7.jpg'
import wc8 from '../assets/Wc8.jpg'
import wc9 from '../assets/Wc9.jpg'
import men1 from '../assets/MenC(1).jpg'
import men2 from '../assets/MenC(2).jpg'
import men3 from '../assets/MenC(3).jpg'
import men4 from '../assets/MenC(4).jpg'
import men5 from '../assets/MenC(5).jpg'
import men6 from '../assets/MenC(6).jpg'
import men7 from '../assets/MenC(7).jpg'
import men8 from '../assets/MenC(8).jpg'
import men9 from '../assets/MenC(9).jpg'
import fc1 from '../assets/FC(1).jpg'
import fc2 from '../assets/FC(2).jpg'
import fc3 from '../assets/Fc(3).jpg'
import fc4 from '../assets/Fc(4).jpg'
import fc5 from '../assets/FC(5).jpg'
import fc6 from '../assets/FC(6).jpg'
import fc7 from '../assets/Fc(7).jpg'
import fc8 from '../assets/Fc(8).jpg'
import fc9 from '../assets/Fc(9).jpg'
import sc1 from '../assets/Sc(1).jpg'
import sc2 from '../assets/Sc(2).jpg'
import sc3 from '../assets/Sc(3).jpg'
import sc4 from '../assets/Sc(4).jpg'
import sc5 from '../assets/Sc(5).jpg'
import sc6 from '../assets/Sc(6).jpg'
import sc7 from '../assets/Sc(7).jpg'
import sc8 from '../assets/Sc(8).jpg'
import sc9 from '../assets/Sc(9).jpg'



// stores all product objects for women, men, furniture, and skincare
// maps your local product images into those product entries
// provides helper functions used by pages to get products by category, filter, or id
// keeps category cards, product grid pages, detail pages, and related products all using the same underlying data
// Hero_slider1.jpeg, Hero_slider2.jpeg, Hero_slider3.jpeg: landing carousel hero images
// Cat_W.jpg, Cat_M.jpg, Cat_F.jpg, Cat_S.jpg: category wheel/category card images
// Wc1.jpg to Wc9.jpg: women collection images
// MenC(1).jpg to MenC(9).jpg: men collection images
// FC(1).jpg, FC(2).jpg, Fc(3).jpg to Fc(9).jpg: furniture/home collection images
// Sc(1).jpg to Sc(9).jpg: skincare collection images
// SignupBG(1).png: auth page background



const womenImageMap = {
  Dillon_Espresso_01_XS_cq29kl: wc1,
  'American-Tall-Sarah-MID-RISE-SKINNY-Jean-Blue-front_naeuho': wc2,
  '24SS5337_CB-B-BL_1_rhtacg': wc3,
  'thumb2-4_ejgbpl': wc4,
  '1597263_01_mw2xiy': wc5,
  '653836780_c_magmbh': wc6,
  's7-AI211969378001_alternate10_rbk6o4': wc7,
  'MP000000023423495_437Wx649H_202408242306101_jjbukr': wc8,
  '635e29037403ec6f010f8f6f-summer-dresses-for-women-2022-women-s_wpc6uj': wc9,
}

const menImageMap = {
  AFD_1804_1_uethyr: men1,
  Black3PieceSuit_1445x_t3ymoj: men2,
  image_mxbijq: men3,
  Uathayam_0705202421251_lvkmor: men4,
  'CSMOVSRT7609_1_b3309dc8-5414-4cf1-b982-690b7e08d5b1_kc0aku': men5,
  BM22721_035BM22721_r5fo2w: men6,
  '81GFyf5BmyL._AC_UY1100__ueg5sh': men7,
  '0cee299231fc653299eb552e51cf232c_x8bywp': men8,
  'db1b37b2-ffc5-4ca6-8216-c4b5cf306b86_kdrf87': men9,
  'LK-NFoil-11-Blue-Pyj-12-NJ-FoilLin-423-Crm-1_61adf123-54a2-40ed-8739-ec01fae2aead_f3s3ks': men4,
  tb022js_270_a_ibgpxk: men5,
}

const homeImageMap = {
  cv934_imblk_a0_fq16fb: fc1,
  cb36396ea6b2824175fd8d87444ba8b8_vjojmn: fc2,
  '257442_JET-BLACK_2_humddu': fc3,
  'cv934_imblk_a0_fq16fb__decor': fc4,
  'cb36396ea6b2824175fd8d87444ba8b8_vjojmn__decor': fc5,
  '257442_JET-BLACK_2_humddu__decor': fc6,
  'cv934_imblk_a0_fq16fb__textiles': fc7,
  '257442_JET-BLACK_2_humddu__textiles': fc8,
  'cb36396ea6b2824175fd8d87444ba8b8_vjojmn__textiles': fc9,
  home_decor_accent_scape: fc4,
  home_soft_glow_corner: fc5,
  home_sculpted_table_piece: fc6,
  home_textured_throw_edit: fc7,
  home_cushion_layer_story: fc8,
  home_neutral_fabric_stack: fc9,
}

const skincareImageMap = {
  mac_sku_S4SQ21_1x1_5_nk3svq: sc1,
  B_SGF_10_M1_punjab_c2000x2000_yzuz8r: sc2,
  '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq': sc3,
  'mac_sku_S4SQ21_1x1_5_nk3svq__serums': sc4,
  'B_SGF_10_M1_punjab_c2000x2000_yzuz8r__serums': sc5,
  '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq__serums': sc6,
  'B_SGF_10_M1_punjab_c2000x2000_yzuz8r__spf': sc7,
  'mac_sku_S4SQ21_1x1_5_nk3svq__spf': sc8,
  '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq__sets': sc9,
  skincare_dewy_drop_serum: sc4,
  skincare_barrier_reset_essence: sc5,
  skincare_night_repair_oil: sc6,
  skincare_uv_daily_veil: sc7,
  skincare_cloud_shield_spf: sc8,
  skincare_ritual_edit_box: sc9,
}

const categoryMeta = {
  women: {
    brand: 'Maison Elle',
    tone: 'wardrobe',
    material: 'Soft structured blend',
    care: 'Cold machine wash',
    occasion: 'Daily wear',
    colors: [
      { hex: '#c16278', name: 'Rose' },
      { hex: '#4f5d75', name: 'Slate' },
      { hex: '#dcb4a3', name: 'Sand' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
  },
  men: {
    brand: 'Northline',
    tone: 'tailored',
    material: 'Premium suiting blend',
    care: 'Gentle wash / dry clean',
    occasion: 'Work & weekend',
    colors: [
      { hex: '#1f2a44', name: 'Midnight' },
      { hex: '#7a5c46', name: 'Mocha' },
      { hex: '#5e6b55', name: 'Olive' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
  },
  skincare: {
    brand: 'Lumera',
    tone: 'beauty',
    material: 'Derm-tested formula',
    care: 'Store in a cool dry place',
    occasion: 'Daily routine',
    colors: [
      { hex: '#f4d3d8', name: 'Blush' },
      { hex: '#dcc9f5', name: 'Lilac' },
      { hex: '#d7e6cf', name: 'Mint' },
    ],
    sizes: ['30ml', '50ml', '100ml'],
  },
  home: {
    brand: 'Atelier Furniture',
    tone: 'lifestyle',
    material: 'Premium crafted finish',
    care: 'Wipe clean',
    occasion: 'Modern interiors',
    colors: [
      { hex: '#d7c4b0', name: 'Stone' },
      { hex: '#808b74', name: 'Sage' },
      { hex: '#453d38', name: 'Espresso' },
    ],
    sizes: ['Small', 'Medium', 'Large'],
  },
}

const rawCatalog = {
  women: {
    All: [
      { id: 'Dillon_Espresso_01_XS_cq29kl', name: 'City Dress', price: '2,299' },
      { id: 'American-Tall-Sarah-MID-RISE-SKINNY-Jean-Blue-front_naeuho', name: 'Daily Denim', price: '1,899' },
      { id: '24SS5337_CB-B-BL_1_rhtacg', name: 'White Muscle Tee', price: '1,299' },
    ],
    Tops: [
      { id: 'thumb2-4_ejgbpl', name: 'Structured Top', price: '599' },
      { id: '1597263_01_mw2xiy', name: 'Soft Essential', price: '1,299' },
      { id: '653836780_c_magmbh', name: 'Cotton Camisole', price: '799' },
    ],
    Jeans: [
      { id: 'American-Tall-Sarah-MID-RISE-SKINNY-Jean-Blue-front_naeuho', name: 'Wide Leg Denim', price: '1,899' },
      { id: 's7-AI211969378001_alternate10_rbk6o4', name: 'Wide Leg Blue', price: '2,499' },
      { id: 'MP000000023423495_437Wx649H_202408242306101_jjbukr', name: 'Grey Bootleg', price: '1,999' },
    ],
    Dresses: [
      { id: 'Dillon_Espresso_01_XS_cq29kl', name: 'Party Ready Dress', price: '2,299' },
      { id: '24SS5337_CB-B-BL_1_rhtacg', name: 'Minimal Daywear', price: '1,800' },
      { id: '635e29037403ec6f010f8f6f-summer-dresses-for-women-2022-women-s_wpc6uj', name: 'Summer Dress', price: '999' },
    ],
  },
  men: {
    All: [
      { id: 'AFD_1804_1_uethyr', name: 'Navy Suit', price: '5,999' },
      { id: 'Black3PieceSuit_1445x_t3ymoj', name: 'Street Vest', price: '5,999' },
      { id: 'image_mxbijq', name: 'Weekend Yellow', price: '899' },
    ],
    Shirts: [
      { id: 'Uathayam_0705202421251_lvkmor', name: 'Formal Shirt', price: '1,399' },
      { id: 'image_mxbijq', name: 'T-Shirt', price: '899' },
      { id: 'CSMOVSRT7609_1_b3309dc8-5414-4cf1-b982-690b7e08d5b1_kc0aku', name: 'Checked Shirt', price: '1,299' },
    ],
    Trousers: [
      { id: 'BM22721_035BM22721_r5fo2w', name: 'Slim Fit Trousers', price: '1,899' },
      { id: '81GFyf5BmyL._AC_UY1100__ueg5sh', name: 'Cargo Denim', price: '2,200' },
      { id: '0cee299231fc653299eb552e51cf232c_x8bywp', name: 'Blue Denim', price: '1,999' },
    ],
    Jackets: [
      { id: 'db1b37b2-ffc5-4ca6-8216-c4b5cf306b86_kdrf87', name: 'Casual Blazer', price: '4,500' },
      { id: 'LK-NFoil-11-Blue-Pyj-12-NJ-FoilLin-423-Crm-1_61adf123-54a2-40ed-8739-ec01fae2aead_f3s3ks', name: 'Nehru Jacket', price: '2,400' },
      { id: 'tb022js_270_a_ibgpxk', name: 'Charcoal Tux', price: '7,999' },
    ],
  },
  skincare: {
    All: [
      { id: 'mac_sku_S4SQ21_1x1_5_nk3svq', name: 'Matte Lipstick', price: '599' },
      { id: 'B_SGF_10_M1_punjab_c2000x2000_yzuz8r', name: 'Glow Foundation', price: '1,100' },
      { id: '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq', name: 'Luxury Perfume', price: '19,999' },
      { id: 'skincare_dewy_drop_serum', name: 'Dewy Drop Serum', price: '1,299' },
      { id: 'skincare_barrier_reset_essence', name: 'Barrier Reset Essence', price: '1,499' },
      { id: 'skincare_night_repair_oil', name: 'Night Repair Oil', price: '1,899' },
      { id: 'skincare_uv_daily_veil', name: 'UV Daily Veil', price: '899' },
      { id: 'skincare_cloud_shield_spf', name: 'Cloud Shield SPF', price: '1,099' },
      { id: 'skincare_ritual_edit_box', name: 'Ritual Edit Box', price: '2,499' },
    ],
    Serums: [
      { id: 'B_SGF_10_M1_punjab_c2000x2000_yzuz8r', name: 'Glow Serum', price: '1,100' },
      { id: 'mac_sku_S4SQ21_1x1_5_nk3svq', name: 'Tinted Balm', price: '599' },
      { id: '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq', name: 'Evening Scent', price: '19,999' },
      { id: 'skincare_dewy_drop_serum', name: 'Dewy Drop Serum', price: '1,299' },
      { id: 'skincare_barrier_reset_essence', name: 'Barrier Reset Essence', price: '1,499' },
      { id: 'skincare_night_repair_oil', name: 'Night Repair Oil', price: '1,899' },
    ],
    SPF: [
      { id: 'B_SGF_10_M1_punjab_c2000x2000_yzuz8r', name: 'Daily SPF', price: '1,100' },
      { id: 'mac_sku_S4SQ21_1x1_5_nk3svq', name: 'Tint Protector', price: '599' },
      { id: '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq', name: 'Sun Mist', price: '2,999' },
      { id: 'skincare_uv_daily_veil', name: 'UV Daily Veil', price: '899' },
      { id: 'skincare_cloud_shield_spf', name: 'Cloud Shield SPF', price: '1,099' },
      { id: 'skincare_dewy_drop_serum', name: 'SPF Glow Base', price: '1,299' },
    ],
    Sets: [
      { id: '8d105655-5544-44ba-b9c5-1155ee88d7ee-1000x1000-ZuwouJncJXSLjxzdQDilWHybKKuRxsopqsSJB8WQ_c97mnq', name: 'Beauty Set', price: '4,999' },
      { id: 'B_SGF_10_M1_punjab_c2000x2000_yzuz8r', name: 'Hydration Duo', price: '1,499' },
      { id: 'mac_sku_S4SQ21_1x1_5_nk3svq', name: 'Glow Kit', price: '1,299' },
      { id: 'skincare_ritual_edit_box', name: 'Ritual Edit Box', price: '2,499' },
      { id: 'skincare_barrier_reset_essence', name: 'Barrier Duo', price: '1,499' },
      { id: 'skincare_cloud_shield_spf', name: 'Sun Care Set', price: '1,099' },
    ],
  },
  home: {
    All: [
      { id: 'cv934_imblk_a0_fq16fb', name: 'Living Accent', price: '3,200' },
      { id: 'cb36396ea6b2824175fd8d87444ba8b8_vjojmn', name: 'Shelf Decor', price: '1,800' },
      { id: '257442_JET-BLACK_2_humddu', name: 'Corner Piece', price: '2,400' },
      { id: 'home_decor_accent_scape', name: 'Accent Scape', price: '2,999' },
      { id: 'home_soft_glow_corner', name: 'Soft Glow Corner', price: '3,499' },
      { id: 'home_sculpted_table_piece', name: 'Sculpted Table Piece', price: '2,799' },
      { id: 'home_textured_throw_edit', name: 'Textured Throw Edit', price: '1,699' },
      { id: 'home_cushion_layer_story', name: 'Cushion Layer Story', price: '1,899' },
      { id: 'home_neutral_fabric_stack', name: 'Neutral Fabric Stack', price: '1,599' },
    ],
    Decor: [
      { id: 'cb36396ea6b2824175fd8d87444ba8b8_vjojmn', name: 'Wall Accent', price: '1,800' },
      { id: 'cv934_imblk_a0_fq16fb', name: 'Side Piece', price: '3,200' },
      { id: '257442_JET-BLACK_2_humddu', name: 'Table Detail', price: '2,400' },
      { id: 'home_decor_accent_scape', name: 'Accent Scape', price: '2,999' },
      { id: 'home_soft_glow_corner', name: 'Gallery Corner', price: '3,499' },
      { id: 'home_sculpted_table_piece', name: 'Table Sculpture', price: '2,799' },
    ],
    Lighting: [
      { id: '257442_JET-BLACK_2_humddu', name: 'Ambient Light', price: '2,400' },
      { id: 'cv934_imblk_a0_fq16fb', name: 'Lamp Accent', price: '3,200' },
      { id: 'cb36396ea6b2824175fd8d87444ba8b8_vjojmn', name: 'Soft Glow', price: '1,800' },
      { id: 'home_soft_glow_corner', name: 'Soft Glow Corner', price: '3,499' },
      { id: 'home_sculpted_table_piece', name: 'Warm Table Light', price: '2,799' },
      { id: 'home_decor_accent_scape', name: 'Layered Light Accent', price: '2,999' },
    ],
    Textiles: [
      { id: 'cv934_imblk_a0_fq16fb', name: 'Throw Edit', price: '3,200' },
      { id: '257442_JET-BLACK_2_humddu', name: 'Cushion Set', price: '2,400' },
      { id: 'cb36396ea6b2824175fd8d87444ba8b8_vjojmn', name: 'Layered Fabric', price: '1,800' },
      { id: 'home_textured_throw_edit', name: 'Textured Throw Edit', price: '1,699' },
      { id: 'home_cushion_layer_story', name: 'Cushion Layer Story', price: '1,899' },
      { id: 'home_neutral_fabric_stack', name: 'Neutral Fabric Stack', price: '1,599' },
    ],
  },
}

function formatPriceNumber(value) {
  return new Intl.NumberFormat('en-IN').format(value)
}

function parsePrice(value) {
  return Number(String(value).replace(/,/g, ''))
}

function cloudinaryUrl(id, width = 900, height = 1200) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,g_auto/v1/${id}.jpg`
}

function hashValue(text) {
  return Array.from(text).reduce((total, char, index) => total + char.charCodeAt(0) * (index + 1), 0)
}

function buildProduct(categoryId, filterName, item) {
  const meta = categoryMeta[categoryId]
  const localImage =
    categoryId === 'women'
      ? womenImageMap[item.id]
      : categoryId === 'men'
        ? menImageMap[item.id]
        : categoryId === 'skincare'
          ? skincareImageMap[`${item.id}__${filterName.toLowerCase()}`] || skincareImageMap[item.id]
        : categoryId === 'home'
          ? homeImageMap[`${item.id}__${filterName.toLowerCase()}`] || homeImageMap[item.id]
        : null
  const priceValue = parsePrice(item.price)
  const mrpValue = Math.ceil(priceValue * 1.68 / 100) * 100
  const discountValue = Math.round(((mrpValue - priceValue) / mrpValue) * 100)
  const hash = hashValue(item.id)
  const rating = (4.1 + (hash % 7) * 0.1).toFixed(1)
  const reviewsBase = 480 + (hash % 1600)
  const reviews = reviewsBase >= 1000 ? `${(reviewsBase / 1000).toFixed(1)}k` : `${reviewsBase}`
  const toneCopy = {
    wardrobe: 'built for sharp everyday dressing with clean lines and easy styling.',
    tailored: 'cut to bring structure, polish, and comfort into your rotation.',
    beauty: 'designed to elevate your daily routine with a polished finish.',
    lifestyle: 'made to add warmth, texture, and a curated feel to your space.',
  }

  return {
    id: item.id,
    slug: item.id,
    categoryId,
    filter: filterName,
    brand: meta.brand,
    name: item.name,
    title: `${item.name} ${filterName === 'All' ? 'Edit' : filterName}`,
    price: formatPriceNumber(priceValue),
    priceValue,
    mrp: formatPriceNumber(mrpValue),
    mrpValue,
    discount: `${discountValue}%`,
    rating,
    reviews,
    description: `${item.name} from ${meta.brand} is ${toneCopy[meta.tone]} It is styled for ${filterName.toLowerCase()} moments and detailed to feel premium from the first wear or use.`,
    highlights: [
      `${filterName} focused finish with a refined silhouette`,
      `${meta.material} for a premium feel`,
      `Comfortable enough for ${meta.occasion.toLowerCase()}`,
      `Easy to style with the rest of your ${categoryId} collection`,
    ],
    specs: {
      Category: categoryId === 'home' ? 'Furniture' : categoryId[0].toUpperCase() + categoryId.slice(1),
      Collection: filterName,
      Material: meta.material,
      Care: meta.care,
      Occasion: meta.occasion,
    },
    colors: meta.colors,
    sizes: meta.sizes,
    images: [
      localImage || cloudinaryUrl(item.id, 1200, 1500),
      localImage || cloudinaryUrl(item.id, 900, 1100),
      localImage || cloudinaryUrl(item.id, 720, 900),
    ],
    cardImage: localImage || cloudinaryUrl(item.id, 700, 980),
  }
}

const productLookup = {}

Object.entries(rawCatalog).forEach(([categoryId, filters]) => {
  Object.entries(filters).forEach(([filterName, items]) => {
    items.forEach((item) => {
      if (!productLookup[item.id]) {
        productLookup[item.id] = buildProduct(categoryId, filterName, item)
      }
    })
  })
})

export function getProducts(categoryId, activeSub = 'All') {
  const section = rawCatalog[categoryId] || rawCatalog.women
  const list = section[activeSub] || section.All || []
  return list.slice(0, 3).map((item) => productLookup[item.id])
}

export function getCategoryProducts(categoryId) {
  const section = rawCatalog[categoryId] || rawCatalog.women
  const seen = new Set()
  const items = []

  Object.values(section).forEach((group) => {
    group.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id)
        items.push(productLookup[item.id])
      }
    })
  })

  return items
}

export function getProductById(productId) {
  return productLookup[productId] || null
}

export const allProducts = productLookup
