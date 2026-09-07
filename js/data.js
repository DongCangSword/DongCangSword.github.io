/* ============================================================
   data.js —— 项目数据、语言包、共享状态容器 window.DCS
   ============================================================ */
(function() {
  'use strict';

  window.DCS_DATA = {
    /* 技术标签图标映射：stack=技术栈标签 / langs=语言标签 引用的 key */
    TECH_ICONS: {
      android:    { icon: 'icons/android.png',    label: 'Android' },
      java:       { icon: 'icons/java.png',       label: 'Java' },
      kotlin:     { icon: 'icons/kotlin.png',     label: 'Kotlin' },
      html5:      { icon: 'icons/HTML5.png',      label: 'HTML5' },
      css3:       { icon: 'icons/css.png',        label: 'CSS3' },
      javascript: { icon: 'icons/javascript.png', label: 'JavaScript' }   /* 备用：暂无项目使用 */
    },
    ANDROID_PROJECTS: [
      { id: '01', badge: { 'zh-CN': '安卓', 'zh-TW': '安卓', 'en': 'Android' },
        mock: 'shots/alpha0.jpg',
        name: { 'zh-CN': '账号本', 'zh-TW': '帳號本', 'en': 'AccountBook' },
        desc: { 'zh-CN': '• 账号密码保险箱\n将你在各个网站、App上的账号和密码集中存储于一处，随时查看，不再遗忘。支持批量添加与删除，管理效率翻倍。\n• 智能密码生成器\n内置安全密码生成工具，一键生成高强度复杂密码，让每个平台都用上独一无二的“金钥匙”，从此告别“123456”和“password”。\n• 银行级加密防护\n采用AES-256对称加密算法，结合PBKDF2密钥派生函数（60万轮迭代），本地加密存储所有数据。即使手机丢失，他人也无法破解。\n• 双重身份验证锁\n初次启动时需设置四位数字密码与密保问题，每次打开App均需验证，为你的密码库再加上一把锁。\n• 灵活的数据导入导出\n支持明文导入导出（TXT / JSON格式），方便数据迁移与备份。同时提供AES-256加密导入导出，分享或同步数据时也能确保安全。\n• 三种主题，随你所好\n内置日间、夜间及跟随系统三种主题模式，无论在明亮户外还是暗光环境，都能获得舒适的视觉体验。', 
                'zh-TW': '• 帳號密碼保險箱\n將你在各個網站、App上的帳號和密碼集中儲存於一處，隨時查看，不再遺忘。支援批量新增與刪除，管理效率翻倍。\n• 智慧密碼產生器\n內建安全密碼產生工具，一鍵產生高強度複雜密碼，讓每個平台都用上獨一無二的「金鑰匙」，從此告別「123456」和「password」。\n• 銀行級加密防護\n採用AES-256對稱加密演算法，結合PBKDF2金鑰派生函數（60萬輪迭代），本地加密儲存所有資料。即使手機遺失，他人也無法破解。\n• 雙重身份驗證鎖\n初次啟動時需設定四位數字密碼與密保問題，每次開啟App均需驗證，為你的密碼庫再加上一把鎖。\n• 靈活的資料匯入匯出\n支援明文匯入匯出（TXT / JSON格式），方便資料遷移與備份。同時提供AES-256加密匯入匯出，分享或同步資料時也能確保安全。\n• 三種主題，隨你所好\n內建日間、夜間及跟隨系統三種主題模式，無論在明亮戶外還是暗光環境，都能獲得舒適的視覺體驗。', 
                'en': '• Account Password Vault\nStore all your usernames and passwords from various websites and apps in one secure place – view them anytime, never forget again. Support batch adding and deletion, doubling your management efficiency.\n• Smart Password Generator\nBuilt‑in secure password generator that creates strong, complex passwords with a single tap. Give every platform its own unique “golden key” and say goodbye to “123456” and “password”.\n• Bank‑Grade Encryption Protection\nUses AES‑256 symmetric encryption combined with PBKDF2 key derivation function (600,000 iterations) to store all data locally in encrypted form. Even if your phone is lost, your data remains unbreakable.\n• Two‑Factor Authentication Lock\nOn first launch, you set a 4‑digit PIN and security questions. The app requires verification every time you open it – adding an extra lock to your password vault.\n• Flexible Data Import / Export\nSupports plain‑text import/export (TXT / JSON formats) for easy data migration and backup. Also offers AES‑256 encrypted import/export, keeping your data safe when sharing or syncing.\n• Three Themes to Match Your Mood\nBuilt‑in Light, Dark, and System‑default themes. Whether outdoors in bright sunlight or in a dim environment, you always enjoy a comfortable visual experience.' },
        req:  { 'zh-CN': 'Android 7.0+(API 24) · 存储 89.7MB', 'zh-TW': 'Android 7.0+(API 24) · 儲存 89.7MB', 'en': 'Android 7.0+(API 24)· 89.7MB storage' },
        icon: '🏠', appicon: 'icons/app1.jpg', stack: ['android'], langs: ['java'], 
        shots: ['shots/alpha1.png', 'shots/alpha2.png', 'shots/alpha3.png']},
      { id: '02', badge: { 'zh-CN': '安卓', 'zh-TW': '安卓', 'en': 'Android' },
        mock: 'shots/beta0.jpg',
        name: { 'zh-CN': '原神：星穹方舟', 'zh-TW': '原神：星穹方舟', 'en': 'GachaSimulator\nForAndroid' },
        desc: { 'zh-CN': '• 一键生成角色获得页\n选择你喜爱的游戏（明日方舟、原神、崩坏：星穹铁道），即可快速生成逼真的角色获取页面，复刻游戏内抽卡“出货”的惊喜瞬间，满足你的收藏与分享欲。\n• 自定义立绘图片\n支持从相册或文件管理中导入任意图片作为角色立绘，无论是游戏原画、同人作品还是你的个人创作，都能完美融入获得页面，打造真正独一无二的角色卡。\n• 自由设定角色属性\n星级、元素/职业、角色名称、阵营/所属等核心信息均可随心调整。你可以还原官方角色，也可以脑洞大开创建属于自己的原创角色，玩法千变万化。\n• 多款游戏风格模板\n内置明日方舟、原神、崩坏：星穹铁道三种主流二次元游戏的获得页面模板，还原度极高。切换游戏主题，UI布局、字体、配色自动适配，体验原汁原味。\n• 一键导出与分享\n生成后的角色获得页面可高清保存至系统相册，或导出至指定下载目录。方便你随时分享到社交媒体、朋友圈，与好友一起炫耀你的“欧气”成果。', 
                'zh-TW': '• 一鍵生成角色獲得頁\n選擇你喜愛的遊戲（明日方舟、原神、崩壞：星穹鐵道），即可快速生成逼真的角色獲取頁面，復刻遊戲內抽卡「出貨」的驚喜瞬間，滿足你的收藏與分享慾。\n• 自訂立繪圖片\n支援從相簿或檔案管理中匯入任意圖片作為角色立繪，無論是遊戲原畫、同人作品還是你的個人創作，都能完美融入獲得頁面，打造真正獨一無二的角色卡。\n• 自由設定角色屬性\n星級、元素/職業、角色名稱、陣營/所屬等核心資訊均可隨心調整。你可以還原官方角色，也可以腦洞大開創建屬於自己的原創角色，玩法千變萬化。\n• 多款遊戲風格模板\n內建明日方舟、原神、崩壞：星穹鐵道三種主流二次元遊戲的獲得頁面模板，還原度極高。切換遊戲主題，UI佈局、字體、配色自動適配，體驗原汁原味。\n• 一鍵匯出與分享\n生成後的角色獲得頁面可高畫質儲存至系統相簿，或匯出至指定下載目錄。方便你隨時分享到社群媒體、朋友圈，與好友一起炫耀你的「歐氣」成果。', 
                'en': '• One‑Tap Character Acquisition Page Generator\nChoose your favorite game (Arknights, Genshin Impact, or Honkai: Star Rail) to instantly generate a realistic character acquisition page that recreates the thrill of a “lucky pull” – perfect for collecting and sharing.\n• Customizable Portrait Artwork\nImport any image from your gallery or file manager as the character’s portrait – whether it’s official art, fan art, or your own creation – and have it seamlessly embedded into the page to create a truly one‑of‑a‑kind character card.\n• Freely Adjust Character Attributes\nStar rank, element/class, character name, faction/affiliation, and other key details are all fully customizable. Recreate official characters or unleash your creativity to design original ones – the possibilities are endless.\n• Multiple Game‑Style Templates\nBuilt‑in templates for three major anime‑style games: Arknights, Genshin Impact, and Honkai: Star Rail – with high fidelity to the originals. Switching game themes automatically adapts the UI layout, fonts, and color schemes for an authentic feel.\n• One‑Tap Export & Sharing\nThe generated acquisition page can be saved in high resolution to your system gallery or exported to a specified download folder. Share your “lucky pull” results instantly on social media or with friends.' },
        req:  { 'zh-CN': 'Android 13.0+(API 33) · 存储 76.1MB', 'zh-TW': 'Android 13.0+(API 33) · 儲存 76.1MB', 'en': 'Android 13.0+(API 33) · 76.1MB storage' },
        icon: '💪', appicon: 'icons/app2.jpg', stack: ['android'], langs: ['java', 'kotlin'], shotRatio: 2400 / 1080,
        shots: ['shots/beta1.jpg', 'shots/beta2.jpg', 'shots/beta3.jpg'] },
      { id: '03', badge: { 'zh-CN': '安卓', 'zh-TW': '安卓', 'en': 'Android' },
        mock: 'shots/gama0.jpg',
        name: { 'zh-CN': '晃动图片工坊', 'zh-TW': '晃動圖片工坊', 'en': 'ImageShaking Workshop' },
        desc: { 'zh-CN': '• 导入图片，即刻开始\n支持 PNG、JPEG、WebP 格式图片导入，无论是照片、插画还是设计稿，拖入即可开始创作，操作门槛极低。\n• 涂抹晃动区域\n在图片上自由涂抹，标记出你想要晃动的区域。带有颜色和图案的区域会随之晃动，未涂抹的部分保持静止，精准控制动画效果。\n• 三档晃动强度可调\n提供弱、中、强三档晃动强度，轻轻一调即可改变动画幅度，从细微颤抖到大幅摇摆，满足不同创作需求。\n• 日间 / 夜间双主题\n内置日间与夜间两套主题，一键切换，无论在明亮环境还是暗光下都能舒适使用。\n• 纯本地处理，隐私无忧\n图片、区域数据和录制结果仅在设备本地处理，不会上传或保存到服务器。仅语言设置会被持久保存，无需担心隐私泄露。', 
                'zh-TW': '• 匯入圖片，即刻開始\n支援 PNG、JPEG、WebP 格式圖片匯入，無論是照片、插畫還是設計稿，拖入即可開始創作，操作門檻極低。\n• 塗抹晃動區域\n在圖片上自由塗抹，標記出你想要晃動的區域。帶有顏色和圖案的區域會隨之晃動，未塗抹的部分保持靜止，精準控制動畫效果。\n• 三檔晃動強度可調\n提供弱、中、強三檔晃動強度，輕輕一調即可改變動畫幅度，從細微顫抖到大幅搖擺，滿足不同創作需求。\n• 日間 / 夜間雙主題\n內建日間與夜間兩套主題，一鍵切換，無論在明亮環境還是暗光下都能舒適使用。\n• 純本地處理，隱私無憂\n圖片、區域數據和錄製結果僅在設備本地處理，不會上傳或保存到伺服器。僅語言設定會被持久保存，無需擔心隱私洩露。', 
                'en': '• Import Images, Start Instantly\nSupports PNG, JPEG, and WebP image formats. Whether it\'s a photo, illustration, or design draft – just drag and drop to begin creating, with an extremely low learning curve.\n• Paint the Shaking Area\nFreely paint on the image to mark the areas you want to shake. Colored and patterned regions will shake accordingly, while unpainted areas remain still – giving you precise control over the animation effect.\n• Three Adjustable Shake Intensity Levels\nOffers three intensity levels: Low, Medium, and High. A simple adjustment changes the animation amplitude – from subtle trembles to dramatic swings – catering to a variety of creative needs.\n• Light / Dark Dual Themes\nBuilt-in Light and Dark themes – switch with one tap for comfortable use whether in bright environments or low light.\n• Pure Local Processing, Privacy Assured\nImages, region data, and recording results are processed only locally in your device – never uploaded or saved to any server. Only your language preference is persistently stored, so you never need to worry about privacy leaks.' },
        req:  { 'zh-CN': 'Android 7.0+(API 24) · 存储 20MB', 'zh-TW': 'Android 7.0+(API 24) · 儲存 20MB', 'en': 'Android 7.0+(API 24) · 20MB storage' },
        icon: '📓', appicon: 'icons/app3.jpg', stack: ['android'], langs: ['java'], 
        shots: ['shots/gama1.png', 'shots/gama2.png', 'shots/gama3.png'] },
      // { id: '04', badge: { 'zh-CN': '安卓', 'zh-TW': '安卓', 'en': 'Android' },
      //   name: { 'zh-CN': '【替换】项目 Delta', 'zh-TW': '【替換】項目 Delta', 'en': 'Project Delta' },
      //   desc: { 'zh-CN': '【替换】AR 虚拟试衣间，实时肢体追踪', 'zh-TW': '【替換】AR 虛擬試衣間，即時肢體追蹤', 'en': 'AR virtual fitting room with real-time body tracking.' },
      //   req:  { 'zh-CN': 'Android 10.0+ · 需支持 ARCore', 'zh-TW': 'Android 10.0+ · 需支援 ARCore', 'en': 'Android 10.0+· ARCore required' },
      //   icon: '👕', appicon: 'icons/app4.jpg', stack: ['android'], langs: ['java'], 
      //   shots: ['shots/alpha1.png', 'shots/alpha2.png', 'shots/alpha3.png'] },
      // { id: '05', badge: { 'zh-CN': '安卓', 'zh-TW': '安卓', 'en': 'Android' },
      //   name: { 'zh-CN': '【替换】项目 Kappa', 'zh-TW': '【替換】項目 Kappa', 'en': 'Project Kappa' },
      //   desc: { 'zh-CN': '【替换】本地音乐播放器，歌词逐字滚动', 'zh-TW': '【替換】本地音樂播放器，歌詞逐字滾動', 'en': 'Local music player with word-by-word lyrics.' },
      //   req:  { 'zh-CN': 'Android 8.0+ · 存储 40MB', 'zh-TW': 'Android 8.0+ · 儲存 40MB', 'en': 'Android 8.0+· 40MB storage' },
      //   icon: '🎵', appicon: 'icons/app5.jpg', stack: ['android'], langs: ['java'], 
      //   shots: ['shots/alpha1.png', 'shots/alpha2.png', 'shots/alpha3.png'] }
    ],
    WEB_PROJECTS: [
      { id: '05', badge: { 'zh-CN': '网页', 'zh-TW': '網頁', 'en': 'Web' },
        name: { 'zh-CN': '弗洛游戏', 'zh-TW': '弗洛遊戲', 'en': 'Phro Games' },
        mock: 'shots/epsilon0.png',
        desc: { 'zh-CN': '以“库洛游戏”公司的愚人节官方恶搞网页为基本思路设计。', 
                'zh-TW': '以「庫洛遊戲」公司的愚人節官方惡搞網頁為基本思路設計。', 
                'en': 'Designed based on the concept of the April Fool\'s official prank webpage by \'Kuro Game\' company.' },
        url: 'h5/1st/html5/index.html', langs: ['html5', 'css3'] },
      { id: '06', badge: { 'zh-CN': '网页', 'zh-TW': '網頁', 'en': 'Web' },
        name: { 'zh-CN': '我的大学期末作业', 'zh-TW': '我的大學期末作業', 'en': 'Piece Of Shit' },
        mock: 'shots/zeta0.png',
        desc: { 'zh-CN': '期末考试做的换皮网页', 'zh-TW': '期末考試做的換皮網頁', 'en': 'A re-skin of a webpage I made for the final exam' },
        url: 'h5/2nd/index.html', langs: ['html5', 'css3'] }
    ],
        /* 作品墙数据：title/desc 为三语对象，渲染时按当前语言取值
       img：缩略与大图共用（可加可选字段 imgLarge 供 Lightbox 用高清版）
       尺寸故意错落，保证瀑布流效果明显；本地部署时把 img 换成 'images/xxx.jpg' */
    GALLERY: [
      { id: 'g01', img: 'gallery/pic1.png', date: '2026-08-09',
        title: { 'zh-CN': '天女散花', 'zh-TW': '天女撒花', 'en': 'Goddess Scattering Flowers' },
        desc:  { 'zh-CN': '洛邑古城的招牌节目。', 'zh-TW': '洛邑古城的招牌節目。', 'en': 'The signature show of Luoyang Ancient City.' } },
      { id: 'g02', img: 'gallery/pic2.png', date: '2026-07-20',
        title: { 'zh-CN': '信号塔白云', 'zh-TW': '信號塔白雲', 'en': 'Signal Tower & White Cloud' },
        desc:  { 'zh-CN': '那天真的很热。', 'zh-TW': '那天真的很熱。', 'en': 'It was really hot that day.' } },
      { id: 'g03', img: 'gallery/pic3.jpg', date: '2026-08-26',
        title: { 'zh-CN': '黄昏彼岸花', 'zh-TW': '黃昏彼岸花', 'en': 'Orange lotus flowers under the dusk' },
        desc:  { 'zh-CN': '夕阳将自己碾碎，洒向彼岸的枝头，橙色火焰正静默的燃烧着。', 'zh-TW': '夕陽將自己碾碎，灑向彼岸的枝頭，橙色的火焰靜默燃燒。', 'en': 'The setting sun crumbles into fragments, scattering an orange radiance over the branches of the equinox flowers, where an orange flame flickers in silent combustion.' } },
      { id: 'g04', img: 'gallery/pic4.jpg', date: '2026-08-25',
        title: { 'zh-CN': '白云', 'zh-TW': '白雲', 'en': 'Cloud' },
        desc:  { 'zh-CN': '好大的云...', 'zh-TW': '好大的雲...', 'en': 'What a huge cloud ...' } },
      { id: 'g05', img: 'gallery/pic5.jpg', date: '2026-08-21',
        title: { 'zh-CN': '天堂明堂-天堂', 'zh-TW': '天堂明堂-天堂', 'en': 'Magnificent palace' },
        desc:  { 'zh-CN': '不仔细看根本看不出来天上有东西吧', 'zh-TW': '不仔細看根本看不出來天上有東西吧', 'en': 'You can\'t even see there\'s something up in the sky if you don\'t look carefully, right?' } },
      { id: 'g06', img: 'gallery/pic6.png', date: '2026-08-12',
        title: { 'zh-CN': '街头美食', 'zh-TW': '街頭美食', 'en': 'Street Food' },
        desc:  { 'zh-CN': '烤牛丸这一块😋', 'zh-TW': '烤牛丸這一塊😋', 'en': 'Tasty grilled beef meatballs😋' } },
      { id: 'g07', img: 'gallery/pic7.png', date: '2026-08-12',
        title: { 'zh-CN': '动物', 'zh-TW': '動物', 'en': 'Animal' },
        desc:  { 'zh-CN': '没错，它在看你。', 'zh-TW': '沒錯，它在看你。', 'en': 'That\'s right, it\'s looking at you.' } },
      { id: 'g08', img: 'gallery/pic8.png', date: '2026-07-20',
        title: { 'zh-CN': '荷花', 'zh-TW': '荷花', 'en': 'Lotus' },
        desc:  { 'zh-CN': '【出淤泥而不染】', 'zh-TW': '【出淤泥而不染】', 'en': '"Emerging from the mud without being tainted"' } },
      { id: 'g09', img: 'gallery/pic9.jpg', date: '2026-08-26',
        title: { 'zh-CN': '明月', 'zh-TW': '明月', 'en': 'Moon' },
        desc:  { 'zh-CN': '大清光学，尽力了。', 'zh-TW': '大清光學，盡力了。', 'en': 'The telephoto lens sucks, and that\'s the way it is.' } },
      { id: 'g10', img: 'gallery/pic10.jpg', date: '2026-08-22',
        title: { 'zh-CN': '盈凸月', 'zh-TW': '盈凸月', 'en': 'Waxing gibbous moon' },
        desc:  { 'zh-CN': '我可太喜欢拍月亮了。', 'zh-TW': '我可太喜歡拍月亮了。', 'en': 'I\'m crazy about photographing the moon.' } },
      { id: 'g11', img: 'gallery/pic11.jpg', date: '2026-08-15',
        title: { 'zh-CN': '晚霞', 'zh-TW': '晚霞', 'en': 'Sunset glow' },
        desc:  { 'zh-CN': '这朵红云开得太满，太浓，像被猴哥打翻的天庭的胭脂缸。', 'zh-TW': '晚霞這朵紅雲開得太滿，太濃，像被猴哥打翻的天庭的胭脂缸。', 'en': 'The evening glow, resembling a crimson cloud, appears excessively abundant and dense, akin to the celestial rouge vase that was toppled over by Sun Wukong.' } },
      { id: 'g12', img: 'gallery/pic12.png', date: '2026-07-10',
        title: { 'zh-CN': '火烧云', 'zh-TW': '火燒雲', 'en': 'Flame clouds' },
        desc:  { 'zh-CN': '透过天空的缝隙燎向人间的大火。', 'zh-TW': '透過天空的縫隙燎向人間的大火。', 'en': 'A raging fire that leaps through the gaps in the sky, descending to the mortal world.' } }  
    ],
    TECH_DATA: {
      mobile: [
        { name: 'Kotlin / Java', pct: 88 }, { name: 'Flutter / Dart', pct: 72 },
        { name: 'React Native', pct: 65 }, { name: 'Android SDK', pct: 82 },
        { name: '性能优化', pct: 70 }
      ],
      frontend: [
        { name: 'React / Next.js', pct: 90 }, { name: 'Vue / Nuxt', pct: 76 },
        { name: 'TypeScript', pct: 85 }, { name: 'CSS / Tailwind', pct: 80 },
        { name: 'Web 性能', pct: 68 }
      ]
    },
    ABOUT_TEXT: {
      'zh-CN': '<p>东仓刀，独立开发者与设计师。专注移动端与前端领域，追求简洁、高效、有温度的数字产品。</p><p>坚信技术是解决问题的工具，设计是传递价值的桥梁。持续探索人机交互的边界，致力于打造兼具美感与实用性的作品。</p><p>业余时间喜欢摄影，以及研究各种新奇的小众技术。</p>',
      'zh-TW': '<p>東倉刀，獨立開發者與設計師。專注移動端與前端領域，追求簡潔、高效、有溫度的數位產品。</p><p>堅信技術是解決問題的工具，設計是傳遞價值的橋樑。持續探索人機互動的邊界，致力於打造兼具美感與實用性的作品。</p><p>業餘時間喜歡攝影，以及研究各種新奇的小眾技術。</p>',
      'en': '<p>Dongcangsword, independent developer and designer. Focus on mobile and front-end, pursuing clean, efficient, and human-centered digital products.</p><p>Believe that technology is a tool to solve problems, and design is a bridge to convey value. Continuously exploring the boundaries of human-computer interaction, committed to creating works that blend aesthetics and practicality.</p><p>In spare time, enjoy photography, and researching novel niche technologies.</p>'
    },
    CONTACTS: [
      // { icon: '✉️', label: '3553469866@qq.com', href: 'https://mail.qq.com' },
      // { icon: '🐙', label: 'github.com/dongcangsword', href: 'https://github.com/dongcangsword' }
      // { icon: '📝', label: 'blog.dongcang.dev', href: 'https://blog.dongcang.dev' },
    ],
    LANG_LIST: ['zh-CN', 'zh-TW', 'en'],
    LANG_LABELS: ['简', '繁', 'EN'],
    LANG: {
      'zh-CN': {
        nav_home: '首页', nav_work: '作品集', nav_tech: '照片墙', nav_about: '关于我',
        gallery_label: '03 · 照片墙',
        gallery_title: '视觉作品集',
        gallery_desc: '快门与像素收集的片段——摄影、设计与其他视觉试验，错落陈列。',
        work_title: '精选项目', work_desc: '移动端与网页领域的实践探索',
        work_android: 'ANDROID / 安卓应用', work_web: 'WEB / 网页作品',
        tech_title: '技能图谱', tech_desc: '持续打磨的技术能力',
        tech_mobile: '📱 移动端', tech_frontend: '🌐 前端',
        about_title: '关于东仓刀',
        footer_note: '所有内容仅供展示 · 纯静态',
        btn_download: '下载 APK', btn_view: '查看', btn_detail: '详情',
        mock_placeholder: '📱 样机占位 · ',
        confirm_download: '确认下载 {id} 的 APK 文件？',
        alert_download: '[占位] 下载 {id}.apk (链接待替换)',
        alert_preview: '[占位] 预览 {id} (链接待替换)',
        alert_detail: '[占位] 查看 {id} 详情',
        home_title: '东仓刀',
        home_next_hint: '继续探索',
        modal_req: '运行配置',
        home_rotating: ['移动端开发', '前端设计', '全栈探索'],
        footer_photo_decl: '作品墙照片均由本人拍摄，仅用于本站展示，不涉及第三方版权。',
        footer_rights: '东仓刀保留所有权利',
        footer_prev: '上一页',
        footer_next: '下一页',
        footer_start: '开始探索',
        footer_author: '东仓刀',
      },
      'zh-TW': {
        nav_home: '首页', nav_work: '作品集', nav_tech: '照片牆', nav_about: '關於我',
        gallery_label: '03 · 照片牆',
        gallery_title: '視覺作品集',
        gallery_desc: '快門與像素收集的片段——攝影、設計與其他視覺試驗，錯落陳列。',
        work_title: '精選項目', work_desc: '移動端與網頁領域的實踐探索',
        work_android: 'ANDROID / 安卓應用', work_web: 'WEB / 網頁作品',
        tech_title: '技能圖譜', tech_desc: '持續打磨的技術能力',
        tech_mobile: '📱 行動端', tech_frontend: '🌐 前端',
        about_title: '關於東倉刀',
        footer_note: '所有內容僅供展示 · 純靜態',
        btn_download: '下載 APK', btn_view: '檢視', btn_detail: '詳情',
        mock_placeholder: '📱 樣機佔位 · ',
        confirm_download: '確認下載 {id} 的 APK 檔案？',
        alert_download: '[佔位] 下載 {id}.apk (連結待替換)',
        alert_preview: '[佔位] 預覽 {id} (連結待替換)',
        alert_detail: '[佔位] 查看 {id} 詳情',
        home_title: '東倉刀',
        home_next_hint: '繼續探索',
        back_home: '回到首頁',
        modal_req: '運行配置',
        footer_photo_decl: '作品牆照片均由本人拍攝，僅用於本站展示，不涉及第三方版權。',
        footer_rights: '東倉刀保留一切權利',
        footer_prev: '上一頁',
        footer_next: '下一頁',
        footer_start: '開始探索',
        footer_author: '東倉刀',
        home_rotating: ['移動端開發', '前端設計', '全棧探索']
      },
      'en': {
        nav_home: 'Home', nav_work: 'Portfolio', nav_tech: 'Gallery', nav_about: 'About',
        gallery_label: '03 · GALLERY',
        gallery_title: 'Visual Gallery',
        gallery_desc: 'Fragments gathered by shutter and pixels — photography, design and visual experiments.',
        work_title: 'Selected Projects', work_desc: 'Explorations in mobile and web',
        work_android: 'ANDROID / Apps', work_web: 'WEB / Websites',
        tech_title: 'Skill Map', tech_desc: 'Continuously honed abilities',
        tech_mobile: '📱 Mobile', tech_frontend: '🌐 Frontend',
        about_title: 'About Dongcangsword',
        footer_note: 'All content for demo · static',
        btn_download: 'Download APK', btn_view: 'View', btn_detail: 'Details',
        modal_req: 'Requirements',
        mock_placeholder: '📱 Mockup · ',
        confirm_download: 'Confirm download APK for {id}?',
        alert_download: '[Placeholder] Download {id}.apk (link to replace)',
        alert_preview: '[Placeholder] Preview {id} (link to replace)',
        alert_detail: '[Placeholder] View {id} details',
        home_title: 'Dongcangsword',
        home_next_hint: 'Scroll to explore',
        back_home: 'Home',
        footer_photo_decl: 'All gallery photos were taken by me and are shown on this site only, free of third-party copyright.',
        footer_rights: 'DongCangSword All rights reserved.',
        footer_prev: 'Previous',
        footer_next: 'Next',
        footer_start: 'Start Exploring',
        footer_author: 'DongCangSword',
        home_rotating: ['Mobile Dev', 'Frontend Design', 'Full Stack']
      }
    }
  };

  // 共享状态与工具（各模块挂载自己的命名空间到此对象）
  window.DCS = {
    ROUTES: ['index', 'works', 'skills', 'about'],
    PAGE_IDS: { index: 'page-index', works: 'page-works', skills: 'page-skills', about: 'page-about' },
    state: {
      currentLang: 'zh-CN',
      currentTheme: 'light',
      rotatingIndex: 0,
      currentRoute: null,      // 当前激活路由
      transitioning: false,    // 是否正在推入过渡
      activeContainer: null,   // 当前激活容器 DOM
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      hoverable: window.matchMedia('(hover: hover) and (pointer: fine)').matches
    },
    $:  (s) => document.querySelector(s),
    $$: (s) => document.querySelectorAll(s)
  };
})();
