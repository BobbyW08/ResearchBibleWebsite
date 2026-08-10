// Content transcribed from TechConsequences_ParentGuide.html (repo root).
// Keep step/callout copy verbatim when updating — this is user-facing technical
// instruction content, not marketing copy.

export type DeviceId =
  | "iphone"
  | "ipad"
  | "android"
  | "androidtab"
  | "fire"
  | "windows"
  | "mac"
  | "chromebook"
  | "switch"
  | "playstation"
  | "xbox";

export const ALL_DEVICES: DeviceId[] = [
  "iphone",
  "ipad",
  "android",
  "androidtab",
  "fire",
  "windows",
  "mac",
  "chromebook",
  "switch",
  "playstation",
  "xbox",
];

export type ParentPhone = "iphone" | "android";

export type CalloutTone = "amber" | "red" | "green" | "blue";

export type Callout = {
  tone: CalloutTone;
  label: string;
  html: string;
};

export type Step = {
  tone: "setup" | "lock";
  html: string;
};

export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type PanelSection = {
  heading: string;
  /** Only shown when the parent's own phone matches; omit to always show. */
  visibleWhen?: ParentPhone;
  introCallouts?: Callout[];
  steps?: Step[];
  screenshots?: Screenshot[];
  callouts?: Callout[];
  table?: { headers: string[]; rows: string[][] };
  fullWidth?: boolean;
};

export type PanelData = {
  id: DeviceId | "wifi";
  icon: string;
  label: string;
  subtitle: string;
  headerColor: string;
  sections: PanelSection[];
};

export const DEVICE_PICKER: { id: DeviceId; icon: string; label: string }[] = [
  { id: "iphone", icon: "📱", label: "iPhone" },
  { id: "ipad", icon: "📟", label: "iPad" },
  { id: "android", icon: "🤖", label: "Android Phone" },
  { id: "androidtab", icon: "📋", label: "Android Tablet" },
  { id: "fire", icon: "🔥", label: "Amazon Fire Tablet" },
  { id: "windows", icon: "💻", label: "Windows PC / Laptop" },
  { id: "mac", icon: "🍎", label: "Mac / MacBook" },
  { id: "chromebook", icon: "🌐", label: "Chromebook" },
  { id: "switch", icon: "🎮", label: "Nintendo Switch" },
  { id: "playstation", icon: "🕹️", label: "PlayStation 4 / 5" },
  { id: "xbox", icon: "🎯", label: "Xbox" },
];

export const DEVICE_PANELS: Record<DeviceId, PanelData> = {
  iphone: {
    id: "iphone",
    icon: "📱",
    label: "iPhone (Child's)",
    subtitle: "Apple Screen Time & Family Sharing · iOS 16 and later",
    headerColor: "#0f172a",
    sections: [
      {
        heading: "Setup & Lockdown — You have an iPhone",
        visibleWhen: "iphone",
        steps: [
          { tone: "setup", html: `On <b>your iPhone</b>: Settings → tap your name → <b>Family</b>. Tap <b>Add Member → Create Child Account</b>. Enter your child's birthday. Create an Apple ID and temporary password for them. Write it down somewhere safe.` },
          { tone: "setup", html: `On <b>your child's iPhone</b>: Settings → Sign in → enter the child Apple ID you just created. The phone links to your family automatically.` },
          { tone: "setup", html: `On <b>your iPhone</b>: Settings → <b>Screen Time</b> → tap child's name → <b>Turn On Screen Time → Lock Screen Time Settings</b>. Set a 6-digit code only you know. Enter your Apple ID as recovery backup. This passcode prevents your child from ever changing any of these settings.` },
          { tone: "lock", html: `Screen Time → child's name → <b>Downtime</b> → Turn On → set nightly hours (e.g. 9 PM–7 AM) → enable <b>Block at End of Limit</b>. Apps actually lock, not just send a warning. Also set <b>App Limits</b>: Social Networking, Games → 1 minute = effectively blocked all day.` },
          { tone: "lock", html: `Screen Time → child's name → <b>Content &amp; Privacy Restrictions → ON</b>. Set ALL of these to <b>Don't Allow</b>: Installing Apps / Deleting Apps / Passcode Changes / Account Changes / Cellular Data Changes / VPN. Web Content → Limit Adult Websites.` },
          { tone: "lock", html: `<b>Apply as a consequence right now:</b> Screen Time → child's name → Downtime → toggle <b>Downtime Until Tomorrow</b>. Their phone locks in under 30 seconds, from your phone, without touching theirs. Restore the same way.` },
        ],
        screenshots: [
          { src: "https://cdsassets.apple.com/live/7WUAS350/images/apple-account/ios-26-iphone-17-pro-settings-screen-time-family-child-on-tap.png", alt: "Screen Time child", caption: "Screen Time → child's name" },
          { src: "https://cdsassets.apple.com/live/7WUAS350/images/apple-account/ios-26-iphone-17-pro-settings-screen-time-child-manage-screen-time-settings-lock-screen-time-settings.png", alt: "Lock Screen Time", caption: "Lock Screen Time Settings" },
          { src: "https://cdsassets.apple.com/live/7WUAS350/images/apple-account/ios-26-iphone-16-pro-settings-screen-time-content-privacy-restrictions-app-store-media-web-games.png", alt: "App restrictions", caption: "Block installs & deletions" },
        ],
      },
      {
        heading: "Setup & Lockdown — You have an Android",
        visibleWhen: "android",
        introCallouts: [
          { tone: "blue", label: "💡 How This Works for Android Parents", html: `Apple does not have an Android app for Screen Time. You'll set up a Family account through a browser, then configure Screen Time <em>directly on the child's iPhone</em> using a passcode only you know. Your home router becomes your primary remote consequence tool.` },
        ],
        steps: [
          { tone: "setup", html: `On any browser (your Android phone is fine): go to <b>appleid.apple.com → Create Your Apple ID</b>. This is free. You need your own Apple ID to be the Family Organizer. Skip this if you already have one.` },
          { tone: "setup", html: `Go to <b>family.apple.com</b> → <b>Set Up Family → Add a Child</b>. Enter your child's birthday. Create a child Apple ID for them (you'll need a separate email address for them, or create one first). Save the password.` },
          { tone: "setup", html: `On <b>your child's iPhone</b>: Settings → Sign In → enter the child Apple ID you just created. The phone links to your family at family.apple.com.` },
          { tone: "lock", html: `On <b>your child's iPhone</b> (hold it while child isn't watching): Settings → <b>Screen Time → Turn On Screen Time → This is My Child's iPhone → Use Screen Time Passcode</b>. Set a 6-digit code only you know. Enter your Apple ID for recovery. This locks all Screen Time settings — child cannot change anything without your code.` },
          { tone: "lock", html: `Still on the child's iPhone: Screen Time → <b>Content &amp; Privacy Restrictions → ON</b>. Set to Don't Allow: Installing Apps / Deleting Apps / Passcode Changes / Account Changes / Cellular Data Changes / VPN. Then Screen Time → Downtime → set nightly schedule (e.g. 9 PM–7 AM).` },
          { tone: "lock", html: `<b>Applying a consequence:</b> You must hold the phone and enter your Screen Time passcode to change settings manually. <em>For remote consequences without touching their phone</em>: pause the iPhone from your <b>Verizon FiOS or Cox router app</b> — this cuts Wi-Fi immediately. Also restrict cellular: Settings → Cellular Data Changes → Don't Allow (done in step 5) prevents them from using cell data to get around the router block.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Android Parent Key Limitation", html: `You cannot remotely lock an iPhone the way an iPhone parent can via the Screen Time app. Your two remote tools are: (1) your home router app (pause Wi-Fi) and (2) contacting your carrier to suspend cellular service. Set up router controls in the Wi-Fi section below — that's your primary lever.` },
        ],
      },
      {
        heading: "Workarounds to Close (iPhone)",
        callouts: [
          { tone: "amber", label: "⚠️ Watches you type the Screen Time passcode", html: `Turn away or cover the screen when entering it. Use a 6-digit code (harder to memorize at a glance). Change it every few months.` },
          { tone: "amber", label: "⚠️ Connects to neighbor or public Wi-Fi", html: `Content &amp; Privacy → Allow Changes To → Wi-Fi Networks → <b>Don't Allow</b>. Prevents joining any new networks.` },
          { tone: "amber", label: "⚠️ Factory resets the phone", html: `Content &amp; Privacy → Passcode Changes → Don't Allow prevents factory reset without your Screen Time passcode.` },
          { tone: "amber", label: "⚠️ Uses a VPN to bypass filters", html: `Already blocked in Step 5: VPN → Don't Allow. Also block in router security settings for a second layer.` },
          { tone: "amber", label: "⚠️ Uses cellular data to bypass router block", html: `Step 5 above: Cellular Data Changes → Don't Allow locks the cellular toggle so they can't turn data back on.` },
        ],
      },
    ],
  },

  ipad: {
    id: "ipad",
    icon: "📟",
    label: "iPad",
    subtitle: "Apple Screen Time · Works on all iPad models running iPadOS 16+",
    headerColor: "#1e2d4a",
    sections: [
      {
        heading: "Setup & Lockdown — You have an iPhone",
        visibleWhen: "iphone",
        steps: [
          { tone: "setup", html: `On <b>your iPhone</b>: Settings → tap your name → <b>Family → Add Member → Create Child Account</b>. Enter your child's birthday. Create a child Apple ID and save the temporary password. <em>If you already set this up for a child iPhone, the iPad will use the same account — skip to step 2.</em>` },
          { tone: "setup", html: `On the <b>iPad</b>: Settings → tap <b>Sign in to your iPad</b> → enter the child Apple ID. The iPad links to your family. It will now appear separately in your Screen Time list on your iPhone.` },
          { tone: "setup", html: `On <b>your iPhone</b>: Settings → Screen Time → tap your child's name → you'll see both their devices listed. The iPad shows separately. Tap the iPad to set its specific limits. Turn on Screen Time if not already on → <b>Lock Screen Time Settings</b> with a 6-digit code only you know.` },
          { tone: "lock", html: `With the iPad selected: set <b>Downtime</b> → nightly schedule. Consider an earlier cutoff than the iPhone — many kids use iPads for later-night browsing. Enable <b>Block at End of Limit</b>.` },
          { tone: "lock", html: `<b>Content &amp; Privacy Restrictions → ON</b> for the iPad: Installing Apps → Don't Allow / Deleting Apps → Don't Allow / Web Content → Limit Adult Websites (or Allowed Websites Only) / VPN → Don't Allow / Wi-Fi Changes → Don't Allow. Also consider disabling Safari entirely if not needed: Allowed Apps → Safari → OFF.` },
          { tone: "lock", html: `<b>Apply as consequence:</b> Screen Time → child's name → select iPad → Downtime → <b>Downtime Until Tomorrow</b>. Locks within 30 seconds from your phone. For Wi-Fi-only iPads, your router pause is equally effective and even faster.` },
        ],
        screenshots: [
          { src: "https://cdsassets.apple.com/live/7WUAS350/images/ios/ios-26-iphone-16-pro-settings-family-sharing-child-account-overview-parents-guardians-screen-time.png", alt: "Family Sharing child account", caption: "Family Sharing → child account" },
          { src: "https://cdsassets.apple.com/live/7WUAS350/images/apple-account/ios-26-iphone-16-pro-settings-screen-time-content-privacy-restrictions-web-content.png", alt: "Web content", caption: "Web Content restrictions" },
        ],
      },
      {
        heading: "Setup & Lockdown — You have an Android",
        visibleWhen: "android",
        introCallouts: [
          { tone: "blue", label: "💡 How This Works Without an iPhone", html: `You'll create a free Apple account through a browser, link the iPad to a family, then configure Screen Time directly on the iPad. Since you can't remote-control the iPad from your Android phone, your <strong>home router is your primary remote consequence tool</strong>. Set that up too.` },
        ],
        steps: [
          { tone: "setup", html: `<b>Create a free Apple ID for yourself</b> (if you don't have one): on your Android phone's browser, go to <b>appleid.apple.com → Create Your Apple ID</b>. Use your email address. Verify it. This makes you the Family Organizer.` },
          { tone: "setup", html: `<b>Create a child Apple ID</b>: go to <b>family.apple.com</b> → sign in with your new Apple ID → <b>Set Up Family → Add a Child</b>. Enter your child's birthday. You'll need a separate email address for the child (create a new Gmail for them if needed). Set a password and save it.` },
          { tone: "setup", html: `On the <b>iPad</b>: Settings → <b>Sign in to your iPad</b> → enter the child Apple ID and password from step 2. Wait for it to sign in and link. The iPad is now part of your Apple family.` },
          { tone: "lock", html: `On the <b>iPad</b> (hold it privately — child not watching): Settings → <b>Screen Time → Turn On Screen Time → This is My Child's iPad → Use Screen Time Passcode</b>. Set a 6-digit code <em>only you know</em>. Enter your Apple ID for recovery. <b>This is the master lock</b> — your child cannot change any Screen Time settings without this code.` },
          { tone: "lock", html: `Still on the iPad, in Screen Time: → <b>Downtime</b> → Turn On → set nightly schedule (e.g. 9 PM–7 AM). → <b>Content &amp; Privacy Restrictions → ON</b>. Set: Installing Apps → Don't Allow / Deleting Apps → Don't Allow / Web Content → Limit Adult Websites / VPN → Don't Allow / Wi-Fi Changes → Don't Allow. To block Safari: Allowed Apps → Safari → OFF.` },
          { tone: "lock", html: `<b>Applying a consequence:</b> Hold the iPad, enter your Screen Time passcode, and change limits directly on the device. OR — faster and without touching the iPad — <b>pause it from your Verizon FiOS or Cox Wi-Fi app</b>. Since most iPads are Wi-Fi only (no cellular), a router pause fully cuts their internet. This is your go-to remote consequence.` },
        ],
        callouts: [
          { tone: "green", label: "✅ Good News for Wi-Fi-Only iPads", html: `Most iPads don't have a cellular plan — they only connect via Wi-Fi. That means your router app gives you <em>complete</em> remote control: pause Wi-Fi = no internet at all. This actually makes router setup more important than for phones. Make sure you do the Wi-Fi section of this guide.` },
        ],
      },
      {
        heading: "Workarounds to Close (iPad)",
        callouts: [
          { tone: "amber", label: "⚠️ Uses Safari or another browser to access blocked content", html: `Set Web Content → Limit Adult Websites <em>and</em> consider Allowed Websites Only (you manually approve every site). Or disable Safari entirely via Allowed Apps → Safari → OFF and use only the apps you've approved.` },
          { tone: "amber", label: "⚠️ Connects to neighbor or public Wi-Fi", html: `Content &amp; Privacy → Wi-Fi Changes → Don't Allow. This is done in Step 5 above.` },
          { tone: "amber", label: "⚠️ Restores deleted apps from iCloud", html: `With Installing Apps set to Don't Allow, they cannot restore apps from iCloud or download new ones — both require going through the App Store, which is blocked.` },
          { tone: "blue", label: "💡 Screen Placement Note", html: `For young children with an iPad, physical location matters as much as software. Keep the iPad in a common room, charging station in the kitchen at night, not in the bedroom. No setting replaces being in the room.` },
        ],
      },
    ],
  },

  android: {
    id: "android",
    icon: "🤖",
    label: "Android Phone (Child's)",
    subtitle: "Google Family Link · Android 10 and later · Works from any parent phone",
    headerColor: "#1565c0",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On <b>your phone</b> (iPhone or Android): install <b>Google Family Link</b> from your app store (free). Open it → Get Started → tap <b>For a child or teen</b>. Follow the prompts to create a supervised Google account for your child, or connect an existing one.` },
          { tone: "setup", html: `On your <b>child's Android phone</b>: sign in with the supervised Google account. A setup code may appear to confirm the link. Once confirmed, the device appears in your Family Link app with full controls.` },
          { tone: "setup", html: `Family Link → child's name → <b>Controls → Screen time → Set time limits</b>. Set a daily total (e.g. 2 hours school days / 3 hours weekends). Under <b>Bedtime</b>: set the hours the screen locks completely (e.g. 9 PM–7 AM). The screen will not turn on during bedtime.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `Family Link → child's name → <b>Controls → App limits</b>. Tap any app → select <b>Blocked</b>. Priority blocks: TikTok, YouTube, Discord, Snapchat, Instagram, Roblox, any web browser not needed for school. Also: Controls → Manage Google Play → <b>Require approval for all apps</b>. Every install needs your OK before it downloads.` },
          { tone: "lock", html: `On the child's phone: Settings → Accounts → verify there is <b>only ONE Google account</b> — the supervised one. Remove any others. Also in Family Link: Controls → <b>Google Chrome</b> → set to Approve Sites or limit to supervised content. Controls → <b>Location</b> → turn on so you know where the phone is.` },
          { tone: "lock", html: `<b>Apply as consequence now:</b> Family Link → child's device → tap the three dots (or lock icon) → <b>Lock device now</b>. Their phone shows "Device locked by [your name]" and becomes unusable for anything except emergency calls. Unlock from your app when ready.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Android", html: `<b>Second Google account:</b> Check Settings → Accounts monthly — remove any non-supervised accounts immediately. <b>Factory reset:</b> Configure Family Link to require parent approval to remove supervision. A reset wipes supervision too — the phone doesn't return until re-enrolled. <b>VPN apps:</b> Block in Family Link app limits before they install one.` },
        ],
      },
    ],
  },

  androidtab: {
    id: "androidtab",
    icon: "📋",
    label: "Android Tablet",
    subtitle: "Google Family Link · Same app controls phone and tablet separately",
    headerColor: "#0d47a1",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `Install <b>Google Family Link</b> on your phone if you haven't already (it's free on both iPhone and Android). Sign in with your Google account. If you already set it up for an Android phone, you do <em>not</em> need a second installation — one Family Link app manages all devices.` },
          { tone: "setup", html: `On the <b>tablet</b>: sign in with your child's supervised Google account (the same one linked to Family Link). The tablet links automatically and appears as a <em>separate device</em> in your Family Link app — distinct from the phone, with its own controls.` },
          { tone: "setup", html: `In Family Link → child's name → tap the <b>tablet device specifically</b>. Set a separate screen time limit. Consider more restrictive limits here — tablets are typically used for longer entertainment sessions. Set a bedtime schedule (tablets often stay on later than phones).` },
        ],
        callouts: [
          { tone: "blue", label: "💡 Tablets vs. Phones in Family Link", html: `Family Link controls each device independently. Set tighter limits on the tablet for apps like YouTube and games, since tablets are primarily used for those. The phone and tablet do not share the same time pool — each has its own daily limit clock.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `Family Link → child → App Limits (select the tablet). Block: YouTube, all social apps, Discord, any browser not needed for school. Require approval for all new installs. Tablets accumulate apps quickly — audit the installed app list monthly and block anything you don't recognize.` },
          { tone: "lock", html: `Family Link → child → <b>Chrome settings</b> (for the tablet) → set to <b>Approved Sites Only</b>. Tablets are used heavily for browsing — this matters more on tablets than phones. Also check: Settings → Accounts on the tablet → verify only ONE Google account is there, the supervised one.` },
          { tone: "lock", html: `<b>Apply as consequence:</b> Family Link → child's name → tap the tablet in the device list → <b>Lock Device Now</b>. The tablet locks immediately. For an even faster approach, pause it from your home router app — most Android tablets are Wi-Fi only, so a router pause is a complete block.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Samsung Galaxy Tablet Note", html: `Samsung tablets may show "Accounts and backup → Manage accounts" instead of the standard Android path. The logic is the same — look for multiple Google accounts and remove any that aren't the supervised one. Samsung Kids Mode is a separate Samsung feature that can be used alongside Family Link.` },
        ],
      },
    ],
  },

  fire: {
    id: "fire",
    icon: "🔥",
    label: "Amazon Fire Tablet",
    subtitle: "Amazon Kids & Parent Dashboard · Works from iPhone or Android",
    headerColor: "#bf360c",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On the Fire tablet: swipe down → <b>Settings → Parental Controls</b>. Toggle <b>Enable Parental Controls → ON</b>. You'll be asked to set a <b>Parental Controls Password</b> — choose something your child has never seen. <em>Do not use "0000" (the default) or your phone unlock code.</em>` },
          { tone: "setup", html: `On <b>your phone</b> (iPhone or Android): install <b>Amazon Parent Dashboard</b> (search in your app store). Sign in with the same Amazon account linked to the Fire tablet. The tablet appears in the dashboard. This lets you manage it remotely — view usage, set limits, and approve content.` },
          { tone: "setup", html: `On the tablet or in Parent Dashboard: go to <b>Amazon Kids → Set Up Profile</b>. Create a child profile with your child's name and age. The system automatically adjusts content to age-appropriate material. Assign the tablet to this profile.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `In Parent Dashboard or Amazon Kids settings: set <b>Daily Screen Time Goals</b> — total time per day, plus separate limits for video, apps, and reading (yes, reading time is separate and often unlimited, which is fine). Set a <b>Bedtime</b> — the tablet screen locks automatically at that time each night.` },
          { tone: "lock", html: `In Parental Controls on the tablet (enter your password): block the <b>Amazon Store</b> (prevents all purchases and new app downloads), disable the <b>Web Browser</b>, turn off <b>Social Sharing</b>, and disable <b>Location Services</b>. Also: Settings → Security → <b>Apps from Unknown Sources → OFF</b> (prevents sideloading apps downloaded from websites).` },
          { tone: "lock", html: `<b>Apply as consequence:</b> In Parent Dashboard on your phone → child's profile → tap <b>Pause</b>. The tablet becomes non-functional (they see a message that time is paused). Alternatively, on the tablet directly: enter your Parental Controls password → set Daily Goal to 0 minutes for today. Resume the same way.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Fire Tablet", html: `<b>Exits Amazon Kids:</b> Requires your Parental Controls password to exit. Change it from default "0000" the moment you set up the tablet. <b>Factory reset:</b> Fire tablets can be factory reset from the power menu — this removes all controls. Keep the tablet in shared spaces. <b>Side-loading:</b> Apps from Unknown Sources → OFF (done in step 5) blocks installing anything downloaded from outside the Amazon store.` },
        ],
      },
    ],
  },

  windows: {
    id: "windows",
    icon: "💻",
    label: "Windows PC / Laptop",
    subtitle: "Microsoft Family Safety · Works from iPhone or Android · Windows 10 & 11",
    headerColor: "#004b8d",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On the PC: Settings → Accounts → <b>Family &amp; other users → Add a family member</b>. Select "Child." If your child doesn't have a Microsoft account, create one free at <b>account.microsoft.com</b> first — you need an email address for them.` },
          { tone: "setup", html: `On <b>your phone</b> (iPhone or Android): install <b>Microsoft Family Safety</b> (free). Sign in with the same Microsoft account. Your child appears in the app. Their PC is now linked and manageable remotely.` },
          { tone: "setup", html: `Family Safety app → child's name → <b>Screen time</b>. Set a daily PC time limit (e.g. 2 hours school days). Set specific allowed hours — e.g. 4 PM–8 PM on weekdays. Outside those hours, the child's account locks and displays a "screen time is up" message.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Critical First Step — Account Type", html: `Before anything else: verify your child's Windows account is a <b>Standard User</b>, not an Administrator. Admin accounts can disable Family Safety entirely. Settings → Accounts → Family — check the account type shown. If it says Administrator, change it to Standard User first.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `Family Safety → child → <b>Content filters</b>: turn on web filtering (blocks adult sites, enforces safe search). Add specific blocked sites manually if needed. Also turn on <b>App &amp; game limits</b> — block any app you don't want them using (Discord, Steam games above a certain rating, non-school browsers).` },
          { tone: "lock", html: `Family Safety → child → <b>Spending</b> → set monthly limit to $0. No Microsoft Store purchases without your approval. Also: if Steam is installed, set up <b>Steam Family View</b> — open Steam → Settings → Family → Family View → set a PIN → restrict purchases and mature content.` },
          { tone: "lock", html: `<b>Apply as consequence now:</b> Family Safety → child → Screen time → change today's remaining time to <b>0 minutes</b>. Their Windows account locks immediately — they see "Your screen time is up for today." You restore access by increasing the limit from your phone.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Windows", html: `<b>Uses Chrome or Firefox instead of Edge:</b> Family Safety content filters work best in Microsoft Edge. Block Chrome and Firefox installs in App limits. Use your router's content filtering as a backup for other browsers. <b>Incognito/Private mode:</b> Family Safety does not monitor private browsing — add router-level DNS filtering (your Verizon/Cox router has content filtering built in). <b>Guest account:</b> Disable the Windows Guest account — Settings → Accounts → Family → verify no guest accounts exist.` },
        ],
      },
    ],
  },

  mac: {
    id: "mac",
    icon: "🍎",
    label: "Mac / MacBook",
    subtitle: "macOS Screen Time · Works from iPhone (Family Sharing) or on-device setup for Android parents",
    headerColor: "#37474f",
    sections: [
      {
        heading: "Setup & Lockdown — You have an iPhone",
        visibleWhen: "iphone",
        steps: [
          { tone: "setup", html: `If your child's Apple ID is already in your Family Sharing (from iPhone/iPad setup), the Mac will automatically appear in Screen Time when your child signs into the Mac with their Apple ID. Go to your iPhone → Settings → Screen Time → child's name → look for the Mac listed under their devices.` },
          { tone: "setup", html: `If setting up fresh: on the Mac → System Settings → <b>Screen Time</b>. Sign in with the child Apple ID. Screen Time turns on. On your iPhone → Settings → Screen Time → child's name → the Mac now appears.` },
          { tone: "setup", html: `Verify the child's Mac account is a <b>Standard User</b> — not an Administrator. System Settings → Users &amp; Groups. If it says Admin, click the lock icon (enter Mac password) and change account type to Standard. Admin accounts bypass Screen Time.` },
          { tone: "lock", html: `From your iPhone: Screen Time → child's name → select Mac → set <b>Downtime</b> schedule. Set <b>App Limits</b> on Entertainment, Games, and Social Networking categories. Set <b>Communication Limits</b> — controls who they can FaceTime and iMessage.` },
          { tone: "lock", html: `Screen Time → child's Mac → <b>Content &amp; Privacy</b>: Web Content → Limit Adult Websites. Under Apps: hide the App Store if they don't need it. Also: System Settings → Users &amp; Groups on the Mac → disable Guest User account.` },
          { tone: "lock", html: `<b>Apply as consequence:</b> Screen Time on your iPhone → child's Mac → Downtime Until Tomorrow. The Mac locks their account. Or shorten App Limits to 1 minute across all categories for the day. Also works: pause the Mac from your router app.` },
        ],
      },
      {
        heading: "Setup & Lockdown — You have an Android",
        visibleWhen: "android",
        steps: [
          { tone: "setup", html: `Create a free Apple ID for yourself and a child Apple ID at <b>family.apple.com</b> (see iPad Android section for full steps). Sign the child into the Mac with their child Apple ID under System Settings → Sign In.` },
          { tone: "setup", html: `Check account type first: Mac → System Settings → Users &amp; Groups. The child's account must be <b>Standard User</b> — not Admin. If it's Admin, enter the Mac admin password and change it now.` },
          { tone: "setup", html: `On the <b>Mac itself</b> (while child isn't watching): System Settings → <b>Screen Time → Turn On Screen Time → Use Screen Time Passcode</b>. Set a passcode only you know. Enter your Apple ID for recovery.` },
          { tone: "lock", html: `Still on the Mac: Screen Time → <b>Downtime</b> → set nightly schedule. <b>Content &amp; Privacy</b>: Web Content → Limit Adult Websites. App Limits: set limits for Games, Entertainment, Social Networking categories.` },
          { tone: "lock", html: `System Settings → Users &amp; Groups → disable <b>Guest User</b>. Do not share the Mac admin password. Store it somewhere your child cannot access (password manager or written note in a secure place).` },
          { tone: "lock", html: `<b>Apply as consequence:</b> Hold the Mac, enter Screen Time passcode, set remaining time to 0. OR — fastest remote option — pause the Mac from your home router app. The Mac will lose internet but can still run offline apps; the router pause is still a significant consequence.` },
        ],
      },
      {
        heading: "Workarounds to Close (Mac)",
        callouts: [
          { tone: "amber", label: "⚠️ Knows Mac admin password", html: `Never share the Mac admin password. It's needed to change account types and disable Screen Time. If your child knows it, change it immediately: System Settings → Users &amp; Groups → click your admin account → Change Password.` },
          { tone: "amber", label: "⚠️ Uses private/incognito browsing", html: `Screen Time applies to Safari. For Chrome/Firefox: block installs via App Limits or use router-level DNS content filtering (your Verizon/Cox router has this).` },
          { tone: "amber", label: "⚠️ Uses Guest account", html: `Guest mode on Mac has NO Screen Time restrictions. Disable it: System Settings → Users &amp; Groups → Guest User → toggle off.` },
        ],
      },
    ],
  },

  chromebook: {
    id: "chromebook",
    icon: "🌐",
    label: "Chromebook",
    subtitle: "Google Family Link · Same app as Android · Works from iPhone or Android",
    headerColor: "#1a6fb5",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `Google Family Link controls Chromebooks through the same supervised Google account as Android phones. If you've already set up Family Link for any device, the Chromebook just needs your child to sign in with that same supervised account — it links to Family Link automatically.` },
          { tone: "setup", html: `On the Chromebook sign-in screen: enter the supervised Google account. The Chromebook will show <em>"Managed by [parent name]"</em> after login. Your child cannot change account settings or sign out without your approval. The Chromebook appears in your Family Link app as a separate device.` },
          { tone: "setup", html: `Family Link → child's name → select the Chromebook device → <b>Screen time</b>. Set a separate daily limit for the Chromebook (often used for longer periods than a phone — set accordingly). Set a bedtime lock for the Chromebook as well.` },
        ],
        callouts: [
          { tone: "blue", label: "💡 School-Issued Chromebook vs. Home Chromebook", html: `If the Chromebook is issued by school, it may already be managed by the school district's Google account — your Family Link may not apply. School-managed Chromebooks are controlled by IT. This section applies to Chromebooks your family owns. When in doubt, check with the school IT department.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `Family Link → child → <b>Chrome browser settings → Approved Sites Only</b> (most restrictive) or "Try to block explicit sites" (moderate). You can add specific approved sites to the list. This restricts the entire Chrome browser — the main way Chromebooks access the internet.` },
          { tone: "lock", html: `Family Link → child → <b>Extensions</b>: all Chrome extension installs require your approval on supervised accounts. Verify this is enforced. Also check: Family Link → child → Android apps (if Android apps are enabled on the Chromebook) → same app blocking rules apply.` },
          { tone: "lock", html: `<b>Apply as consequence:</b> Family Link → child → select the Chromebook → <b>Lock Device</b>. Screen locks with "Device locked by family member." OR pause from your home router — Chromebooks are always Wi-Fi connected, so a router pause is a complete lockout. Restore from the app.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Chromebook", html: `<b>Guest mode:</b> Disabled by default on supervised accounts — verify it stays off. <b>Linux environment:</b> Some Chromebooks support Linux (a separate OS environment that bypasses Chrome controls). Check Settings → About ChromeOS → Linux Development Environment — if enabled, disable it. <b>Extensions:</b> Malicious or bypass extensions require your approval to install on supervised accounts.` },
        ],
      },
    ],
  },

  switch: {
    id: "switch",
    icon: "🎮",
    label: "Nintendo Switch",
    subtitle: "Nintendo Switch Parental Controls app · Free · Works from iPhone or Android · All Switch models",
    headerColor: "#c01b2c",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On your phone (iPhone or Android): download <b>Nintendo Switch Parental Controls</b> (free from your app store). Open it → tap <b>Register Console</b>.` },
          { tone: "setup", html: `On the Switch console: System Settings (gear icon on home screen) → <b>Parental Controls → Use This Console with Nintendo Switch Parental Controls</b>. A <b>6-digit registration code</b> appears on the TV. Enter it in the phone app to pair them. The consoles link instantly.` },
          { tone: "setup", html: `In the app you'll set a <b>PIN</b> — this is different from the registration code. Your child must enter this PIN to override any parental control restriction (like requesting extra time). Make it something only you know. You'll use it to approve or deny override requests.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `In the app: set <b>Play Time Limit</b> (daily maximum, e.g. 2 hours). Set a <b>Bedtime Alarm</b> time. Choose <b>Suspend Console</b> mode (not just "Alarm only") — this actually locks the console when time is up, not just sends a notification your child can dismiss. The Switch will lock even mid-game.` },
          { tone: "lock", html: `In the app under <b>Restriction Level</b> or individual settings: disable <b>Nintendo eShop</b> (no purchases or free game downloads) / restrict <b>Online Play</b> (no playing with strangers) / restrict <b>Communication</b> (no chat with unknown players) / set <b>Content Rating Limit</b> (blocks games above your chosen age rating from launching).` },
          { tone: "lock", html: `<b>Apply as consequence right now:</b> App → your console → tap <b>Suspend Console</b>. The Switch immediately shows "The console has been suspended by a parent or guardian" and becomes unplayable. Resume from the app when ready. You can also extend or reduce daily play time from the app in real time.` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Switch", html: `<b>PIN override:</b> Each time your child uses the PIN to request more time, the app logs it. Review the activity log weekly — patterns matter. Repeated PIN overrides are a conversation. <b>Different user profile:</b> Controls apply per-console, not per-profile. All users on the Switch are subject to the same parental controls set in the app. <b>Airplane mode offline play:</b> Some games play offline in Airplane mode — Suspend Console from the app overrides even this.` },
        ],
      },
    ],
  },

  playstation: {
    id: "playstation",
    icon: "🕹️",
    label: "PlayStation 4 / 5",
    subtitle: "PlayStation Family Management · Managed via browser on any device · No separate app required",
    headerColor: "#002b83",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On any browser (phone, computer — works on iPhone and Android): go to <b>account.sonyentertainmentnetwork.com</b>. Sign in with your PlayStation Network (PSN) account. If you don't have one, create a free one — this becomes your Family Manager account.` },
          { tone: "setup", html: `In the PSN account settings → <b>Family Management → Add Family Member → Add Child</b>. Create a child PSN account. You'll need a separate email address for them. Set their birthday (this determines what content ratings they can access). Save the login credentials.` },
          { tone: "setup", html: `On the PlayStation console: sign in with the child PSN account. The console is now linked to your Family Manager. All restrictions you set through the web portal apply to this account on this console.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `At <b>account.sonyentertainmentnetwork.com → Family Management → child's name</b>: set <b>Monthly Spending Limit → $0</b> (no purchases at all). Set <b>Age Rating Level for Games</b> to the maximum you allow (e.g. Everyone 10+, Teen, or Mature). Games above the rating cannot be launched. Apply same ratings to Blu-ray/DVD and PS Store browsing.` },
          { tone: "lock", html: `Family Management → child → <b>Communication &amp; User-Generated Content</b>: restrict who they can send/receive messages from. Set to Friends Only. Also: restrict Voice Chat with Unknown Players. On the <b>console itself</b>: Settings → Parental Controls → set a 4-digit <b>system passcode</b> (locks console-level settings changes).` },
          { tone: "lock", html: `<b>Apply as consequence (PS5):</b> Download the <b>PlayStation App</b> on your phone → Family Management → <b>Playtime Settings</b> → set today's allowed time to 0. The PS5 locks them out. <b>PS4 limitation:</b> PS4 does not support remote playtime management — your options are: unplug the console, use your router to cut its Wi-Fi, or use the web portal to reduce spending/communication limits.` },
        ],
        callouts: [
          { tone: "blue", label: "💡 PS5 vs PS4", html: `The PlayStation App gives PS5 parents remote playtime control — a significant advantage. PS4 parental controls are largely set-it-and-forget-it. If your child has a PS4, router-level Wi-Fi control (pause from your Verizon/Cox app) is the most practical remote consequence tool.` },
          { tone: "amber", label: "⚠️ Workarounds to Close for PlayStation", html: `<b>Creating a second PSN account:</b> On a child account, creating new accounts is restricted by default — verify this in Family Management → Account Security. <b>Remote Play bypass:</b> PlayStation Remote Play lets users stream the console to a phone. If this is a concern: Settings → Remote Play Connection Settings → disable it. <b>System passcode:</b> Set in Step 5 — prevents factory reset and system-level changes without the code.` },
        ],
      },
    ],
  },

  xbox: {
    id: "xbox",
    icon: "🎯",
    label: "Xbox (One / Series S / Series X)",
    subtitle: "Xbox Family Settings app · Free · Works from iPhone or Android",
    headerColor: "#0a5e0a",
    sections: [
      {
        heading: "Setup (Steps 1–3)",
        steps: [
          { tone: "setup", html: `On your phone (iPhone or Android): download <b>Xbox Family Settings</b> (free). Sign in with your Microsoft account. Tap <b>Add a child account</b> → create a Microsoft account for your child (needs an email for them) or link an existing one. Follow the prompts to complete setup.` },
          { tone: "setup", html: `On the Xbox console: sign in with your child's Microsoft account. The console links to your Family Settings app within a few minutes. Your child's gamertag and console will appear in the app under their profile.` },
          { tone: "setup", html: `Family Settings → child's name → <b>Screen time</b>. Set separate daily time limits for weekdays and weekends (this granularity is a major advantage of Xbox over other consoles). The Xbox automatically signs your child out when time is up.` },
        ],
      },
      {
        heading: "Lockdown (Steps 4–6)",
        steps: [
          { tone: "lock", html: `Family Settings → child → <b>Content</b>: set allowed game age rating (Everyone, Teen, or Mature). Games above the rating cannot be launched even if already installed. Also block: non-game apps (YouTube, browsers, Discord), inappropriate Game Pass titles, and explicit music.` },
          { tone: "lock", html: `Family Settings → child → <b>Spending</b>: set monthly limit to $0. No Xbox Store, Microsoft Store, or in-game purchases without your approval. Each purchase attempt comes to your phone as a request you can approve or deny. → <b>Privacy &amp; online safety</b>: set to "Child" preset — restricts communication with strangers and personal info sharing.` },
          { tone: "lock", html: `<b>Apply as consequence now:</b> Family Settings → child → Screen time → set today's remaining time to <b>0 minutes</b>. The Xbox signs them out immediately, even mid-game. They see "Your screen time is up for today." You restore it by increasing the limit from your phone. Also: pausing from your router app cuts the Xbox's internet (online play and most games require internet).` },
        ],
        callouts: [
          { tone: "amber", label: "⚠️ Workarounds to Close for Xbox", html: `<b>Guest accounts:</b> Guests can play without a Microsoft account in some game modes. In Family Settings → Privacy settings → disable local guest sign-in. <b>Disc games:</b> Content controls apply to disc games based on the disc's age rating at insert. Ensure content rating restrictions are set in Step 4. <b>Offline mode:</b> Screen time limits still apply in offline mode when properly configured — the console tracks time regardless of internet connection.` },
        ],
      },
    ],
  },
};

export const WIFI_PANEL: PanelData = {
  id: "wifi",
  icon: "📡",
  label: "Home Wi-Fi / Router — Always Set This Up",
  subtitle: "Controls ALL devices at once · Works from iPhone or Android · The fastest remote consequence tool you have",
  headerColor: "#1b4332",
  sections: [
    {
      heading: "📡 Verizon FiOS — Verizon Home App",
      steps: [
        { tone: "setup", html: `Download the <b>Verizon Home app</b> (iOS or Android — works on both). Sign in with your Verizon account. <em>Note: The old "My Fios" app was retired in 2024 — if you have it, it no longer works for this. Use Verizon Home.</em>` },
        { tone: "setup", html: `Tap <b>Internet → Devices</b>. Every device connected to your home network appears here. Tap a device → <b>Assign to Profile</b>. Create a profile called "Maya's Devices" (use your child's name). Assign every device your child uses: their phone, tablet, gaming console, laptop.` },
        { tone: "setup", html: `Tap the child's profile → <b>Schedule</b> to set nightly internet blackout (e.g. 9 PM–7 AM and school hours). The internet cuts off on those devices automatically. No manual action needed each night once it's set.` },
        { tone: "lock", html: `Under <b>Parental Controls</b> in the profile: block website categories (adult content, gambling, social media, gaming during school hours) across all assigned devices automatically — no per-device setup.` },
        { tone: "lock", html: `Change the <b>router admin password</b> from its default. On any browser connected to your FiOS network, open <b>192.168.1.1</b> → log in → Settings → change admin password. Keep this somewhere your child cannot access.` },
        { tone: "lock", html: `<b>Apply as consequence right now:</b> Verizon Home app → child's profile → <b>Pause All Devices</b>. Done in 10 seconds. Their phone, tablet, and console all lose internet simultaneously. Restore the same way.` },
      ],
      callouts: [
        { tone: "blue", label: "💡 Backup: Browser Admin", html: `On any device on your FiOS home network: open a browser → <b>192.168.1.1</b> → Parental Controls. Works even without the app installed.` },
      ],
    },
    {
      heading: "📡 Cox Cable — Panoramic WiFi App",
      steps: [
        { tone: "setup", html: `Download the <b>Cox Panoramic WiFi app</b> (iOS or Android). Sign in with your Cox user ID and password. Requires a Cox Panoramic WiFi Gateway — the router says "Panoramic Wifi" on it. If you have an older modem, call Cox to upgrade at no charge.` },
        { tone: "setup", html: `App → WiFi tab (bottom toolbar) → in the Connected section → tap <b>Add a person</b>. Enter your child's name, choose an icon, tap <b>Assign Devices</b>. Check every device your child uses. Tap <b>Assign devices</b>. All their devices are now in one profile.` },
        { tone: "setup", html: `Child's profile → tap the <b>Settings icon</b> (top right) → under <em>Create a Downtime Schedule</em> → tap <b>Get Started</b>. Select days and hours (e.g. Mon–Fri 9 PM–7 AM + all day during school hours). Tap <b>Apply Changes</b>. Runs automatically every day.` },
        { tone: "lock", html: `Profile Settings → <b>Set up Active Time Limit</b>. Set daily limits for weekdays and weekends. Enable <b>Auto-Pause</b> — internet stops automatically when the daily limit is reached, no manual action needed.` },
        { tone: "lock", html: `Profile Settings → <b>Parental Controls → Turn On</b>. Immediately activates: Google SafeSearch, Bing Strict mode, and YouTube Restricted Mode for all assigned devices on your Wi-Fi. No per-device setup needed.` },
        { tone: "lock", html: `<b>Apply as consequence now:</b> WiFi tab → child's device → tap <b>Pause Device</b> (single device). Or tap the profile → <b>Pause All</b> (all their devices at once). A crescent moon appears next to paused devices. Tap <b>Unpause</b> to restore.` },
      ],
    },
    {
      heading: "📡 Other Routers — Quick Reference",
      fullWidth: true,
      table: {
        headers: ["Router / Provider", "App", "Find Controls Here"],
        rows: [
          ["Eero (Amazon)", "Eero app", "Profiles → Pause → Schedule"],
          ["Google / Nest WiFi", "Google Home", "Home → Device → Pause Device"],
          ["Netgear Orbi / Nighthawk", "Netgear app", "Parental Controls → Pause"],
          ["ASUS Router", "ASUS Router app", "AiProtection → Parental Controls"],
          ["TP-Link Deco", "TP-Link Deco app", "More → HomeShield → Parental Control"],
          ["Xfinity / Comcast", "Xfinity app", "Internet → Devices → Pause"],
          ["Any router (manual)", "Browser", "Open 192.168.1.1 → Parental Controls"],
        ],
      },
      callouts: [
        { tone: "red", label: "🚨 Router ≠ Cellular Data", html: `Your router controls Wi-Fi only. A phone with a cellular plan can bypass it completely. You must also restrict cellular data on each phone (done in the iPhone or Android sections above) for complete coverage. This is the most common gap parents miss.` },
      ],
    },
  ],
};

// ── Workarounds kids use, tailored to selected devices ─────────────
export type WorkaroundKey =
  | "st_passcode"
  | "wifi_neighbor"
  | "vpn"
  | "factory_reset"
  | "second_account"
  | "browser_bypass"
  | "cloud_restore"
  | "cellular_bypass"
  | "pin_override"
  | "guest_mode"
  | "wifi_admin"
  | "hotspot";

export const WORKAROUNDS: Record<WorkaroundKey, { title: string; badge: string; fix: string }> = {
  st_passcode: { title: "Watches you enter the Screen Time passcode", badge: "iPhone/iPad", fix: "Use a 6-digit code. Turn away or cover the screen when entering it. Change every few months. Never let them see you enter it even once." },
  wifi_neighbor: { title: "Connects to neighbor or public Wi-Fi to bypass router controls", badge: "Wi-Fi Bypass", fix: "iPhone/iPad: Content & Privacy → Wi-Fi Changes → Don't Allow. Android: lock in Family Link. Also: router controls only work on YOUR network — phone-level controls are the second layer." },
  vpn: { title: "Installs a VPN app to bypass content filters", badge: "VPN Bypass", fix: "iPhone/iPad: Screen Time → VPN → Don't Allow. Android: block VPN apps in Family Link. Router: enable VPN traffic blocking in security settings (Eero, ASUS, Cox Panoramic support this)." },
  factory_reset: { title: "Factory resets the device to remove all parental controls", badge: "Factory Reset", fix: "iPhone: Content & Privacy → Passcode Changes → Don't Allow prevents this. Android: Family Link requires your approval to remove supervision. Amazon Fire: keep tablet in shared spaces (Fire resets are accessible from power menu)." },
  second_account: { title: "Adds a second unmanaged account (Google, Apple, PSN) to bypass supervision", badge: "Second Account", fix: "Android: check Settings → Accounts monthly. iPhone/iPad: Account Changes → Don't Allow in Content & Privacy. PlayStation: Family Management prevents new account creation on child accounts." },
  browser_bypass: { title: "Uses a different browser or private/incognito mode to bypass content filters", badge: "Browser Bypass", fix: "iPhone/iPad: disable Safari or set Allowed Websites Only. Windows: block Chrome/Firefox installs. All devices: router content filtering is your backup layer for any browser." },
  cloud_restore: { title: "Restores a deleted app from iCloud or Google account backup", badge: "Cloud Restore", fix: "iPhone/iPad: with Installing Apps → Don't Allow, they cannot reinstall anything — all installs go through the App Store which is blocked. Android: all installs require your approval in Family Link." },
  cellular_bypass: { title: "Uses cellular data to bypass router/Wi-Fi controls entirely", badge: "Cellular Data", fix: "iPhone: Screen Time → Cellular Data Changes → Don't Allow (locks the toggle). Android: Family Link data usage controls. Router controls have zero effect on cellular — phone-level blocks are essential." },
  pin_override: { title: "Enters the parental control PIN to override console restrictions", badge: "Console PIN", fix: "Each PIN use is logged. Check the activity log weekly — repeated overrides are a conversation. Reduce or remove the override option if abuse is ongoing (Switch and Xbox both support this)." },
  guest_mode: { title: "Uses a guest account or guest mode to bypass all parental controls", badge: "Guest Mode", fix: "Mac: disable Guest User in Users & Groups. Xbox: disable guest sign-in in console settings. Chromebook: verified disabled on supervised accounts. Windows: verify no guest accounts exist in Accounts settings." },
  wifi_admin: { title: "Looks up the router admin password to remove restrictions", badge: "Router Admin", fix: "Change the router admin password from its printed default immediately. Store it in a password manager or locked location. Also rename your Wi-Fi network from its default name." },
  hotspot: { title: "Gets a portable hotspot or secondary SIM card", badge: "Hardware", fix: "Check Settings → Cellular (iPhone) or Settings → Network (Android) periodically for unfamiliar SIM or eSIM connections. At this point, the trust conversation matters more than any technical fix." },
};

export const DEVICE_WORKAROUNDS: Record<DeviceId | "wifi", WorkaroundKey[]> = {
  iphone: ["st_passcode", "wifi_neighbor", "vpn", "factory_reset", "cloud_restore", "cellular_bypass"],
  ipad: ["st_passcode", "wifi_neighbor", "vpn", "cloud_restore", "browser_bypass"],
  android: ["second_account", "wifi_neighbor", "vpn", "factory_reset", "cellular_bypass"],
  androidtab: ["second_account", "wifi_neighbor", "vpn", "browser_bypass"],
  fire: ["factory_reset", "wifi_neighbor"],
  windows: ["browser_bypass", "guest_mode"],
  mac: ["browser_bypass", "guest_mode"],
  chromebook: ["browser_bypass", "guest_mode"],
  switch: ["pin_override"],
  playstation: ["second_account", "pin_override"],
  xbox: ["guest_mode", "pin_override"],
  wifi: ["wifi_neighbor", "vpn", "wifi_admin", "cellular_bypass"],
};

// ── Setup checklist, grouped per device ─────────────────────────────
export const CHECKLISTS: Record<DeviceId | "wifi", { label: string; items: string[] }> = {
  iphone: {
    label: "📱 iPhone (Child's)",
    items: [
      "Screen Time passcode: 6-digit, known only to you, different from your unlock code",
      "Content & Privacy Restrictions → ON",
      "Installing Apps → Don't Allow",
      "Deleting Apps → Don't Allow",
      "Passcode Changes → Don't Allow",
      "Account Changes → Don't Allow",
      "Cellular Data Changes → Don't Allow",
      "VPN → Don't Allow",
      "Web Content → Limit Adult Websites",
      "Downtime scheduled nightly (Block at End of Limit ON)",
      "App Limits on Social Networking, Games, Entertainment",
    ],
  },
  ipad: {
    label: "📟 iPad",
    items: [
      "Child Apple ID created and signed into iPad",
      "Screen Time passcode set on device (Android parent) OR via Family Sharing (iPhone parent)",
      "Downtime scheduled — consider earlier than phone",
      "Installing Apps → Don't Allow",
      "Deleting Apps → Don't Allow",
      "Wi-Fi Changes → Don't Allow",
      "Web Content → Limit Adult Websites OR Allowed Websites Only",
      "Safari disabled if child is young (Allowed Apps → Safari → OFF)",
      "iPad placed in common area, not bedroom, at night",
    ],
  },
  android: {
    label: "🤖 Android Phone (Child's)",
    items: [
      "Google Family Link installed, child's supervised account linked and showing in app",
      "Bedtime lock scheduled (e.g. 9 PM–7 AM)",
      "Daily screen time limit set",
      "High-risk apps blocked: TikTok, YouTube, Discord, Snapchat, Instagram",
      "All new installs require your approval (Manage Google Play setting)",
      "Only ONE Google account on child's phone — checked monthly",
      "Remove supervision requires parent approval (Family Link setting)",
      "VPN apps blocked in app controls",
    ],
  },
  androidtab: {
    label: "📋 Android Tablet",
    items: [
      "Signed in with supervised Google account — appears in Family Link",
      "Separate screen time limit set for tablet (independent of phone)",
      "Chrome → Approved Sites Only configured",
      "Extensions require your approval (verified in Family Link)",
      "YouTube, games, social apps blocked or strictly limited",
      "Installed app list reviewed monthly",
    ],
  },
  fire: {
    label: "🔥 Amazon Fire Tablet",
    items: [
      "Parental Controls password changed from default \"0000\"",
      "Amazon Kids profile created with correct age setting",
      "Amazon Store blocked (no purchases or downloads without you)",
      "Web Browser disabled",
      "Daily time goals and Bedtime set in Parent Dashboard app",
      "Auto-pause at daily limit enabled",
      "Apps from Unknown Sources → OFF (blocks sideloading)",
      "Parent Dashboard app on your phone — tablet visible and manageable",
    ],
  },
  windows: {
    label: "💻 Windows PC / Laptop",
    items: [
      "Child's Windows account is Standard User (NOT Administrator)",
      "Microsoft Family Safety app on your phone, child linked",
      "Daily screen time limits and allowed hours configured",
      "Web content filtering ON (blocks adult sites, enforces SafeSearch)",
      "Spending limit set to $0 on Microsoft Store",
      "Specific apps blocked (Discord, unapproved games, alternate browsers)",
      "Steam Family View set up if Steam is installed (Settings → Family → Family View → set PIN)",
      "Activity reports reviewed weekly in app",
    ],
  },
  mac: {
    label: "🍎 Mac / MacBook",
    items: [
      "Child's Mac account is Standard User (NOT Administrator)",
      "Screen Time passcode set — only you know it",
      "Guest User account disabled (Users & Groups)",
      "Downtime scheduled nightly",
      "Content & Privacy → Limit Adult Websites",
      "App Limits on Entertainment, Games, Social Networking",
      "Mac admin password stored securely, not accessible to child",
      "Mac placed in common area, not bedroom",
    ],
  },
  chromebook: {
    label: "🌐 Chromebook",
    items: [
      "Child signed in with supervised Google account — appears in Family Link",
      "Screen time limits set (separate from phone limits)",
      "Chrome browser → Approved Sites Only configured",
      "Extensions require your approval — verified in Family Link settings",
      "Guest mode confirmed disabled",
      "Linux environment disabled if it was enabled (Settings → About ChromeOS)",
    ],
  },
  switch: {
    label: "🎮 Nintendo Switch",
    items: [
      "Parental Controls app paired to console (6-digit code used)",
      "PIN set (known only to you, different from any code child knows)",
      "Daily play time limit and bedtime set",
      "Suspension mode ON (not just alarm)",
      "Nintendo eShop disabled (no purchases or downloads)",
      "Online play restricted (no communication with strangers)",
      "Content age rating limit set",
      "Image/video social sharing disabled",
    ],
  },
  playstation: {
    label: "🕹️ PlayStation 4 / 5",
    items: [
      "Child PSN account created under your Family Manager account",
      "Monthly spending limit → $0",
      "Game rating restriction set to age-appropriate maximum",
      "Communication: Friends Only (no strangers)",
      "4-digit system passcode set on console",
      "Internet browser restricted or disabled in Family Management",
      "User-generated content restricted",
      "No unauthorized PSN accounts on console (checked monthly)",
    ],
  },
  xbox: {
    label: "🎯 Xbox",
    items: [
      "Xbox Family Settings app on your phone, child account linked",
      "Daily screen time limits set (weekday and weekend separately)",
      "Content rating limit configured",
      "Monthly spending limit → $0",
      "Privacy preset set to \"Child\"",
      "Guest sign-in disabled on console",
      "App and game blocks configured (Discord, inappropriate titles)",
      "Activity reports reviewed in app weekly",
    ],
  },
  wifi: {
    label: "📡 Home Wi-Fi / Router",
    items: [
      "Router admin password changed from factory default — stored securely",
      "Child's devices all assigned to a parental control profile",
      "Nightly internet schedule configured and tested",
      "Manual Pause tested — confirmed it works on all child devices",
      "Cellular data also restricted on phones (router doesn't cover cellular)",
      "Guest network disabled or restricted",
      "Router firmware set to auto-update",
      "VPN traffic blocked in router security settings (if supported)",
    ],
  },
};
