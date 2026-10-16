# Launch Review: Open Findings

Open findings from the pre-launch review of security, privacy, mobile, performance and accessibility. Remove a row when it is resolved. Items marked **BLOCKED-ON-BOBBY** need a decision or action from Bobby.

---

## Security

| Severity | Area | Finding | Action |
|---|---|---|---|
| High | Production migrations | The community and courses tables do not exist in Neon production. The migration `src/migrations/20261013_000000_init_community_collections.ts` is applied on `preview` only. | **BLOCKED-ON-BOBBY:** finish the production cutover in `docs/operations/migrations.md` (push, preview dry run, merge). Required before enabling community, courses or auth routes |
| High | Payload `Users` access | `src/payload/collections/Users.ts` has no `access` block, so Payload's default applies: any logged-in admin user can create, update or delete users, including changing their own `role`. | Add role-based access to `Users` before creating any moderator account |
| Medium | Moderator role | Every collection except `VisitorProfiles` uses an `isAdmin` helper that checks only `!!user`. A moderator has the same access as an admin everywhere else. | Add role checks before creating moderator accounts. See `docs/operations/roles-and-permissions.md` |
| Medium | Suspension enforcement | Suspension is checked only on new posts, new comments and lesson pages. `requireSession()` and `requireProfile()` in `lib/auth/require.ts` are not called anywhere. | Use `requireProfile()` on every gated page and community, course and account route |
| Medium | Account deletion and data export | No self-service delete or export on `/account`. Deletion is manual (`docs/operations/auth.md`). | **BLOCKED-ON-BOBBY:** legal decision on whether self-service is required at launch |
| Medium | Rate limiting | In-memory store resets on every Vercel cold start and is not shared between instances. | Acceptable for launch; move to a shared store if abuse appears |
| Low | `WEBHOOK_SECRET` rotation | A real `WEBHOOK_SECRET` value is in git history in `drive_content_sync_setup.md`. | **BLOCKED-ON-BOBBY:** rotate `WEBHOOK_SECRET` in Vercel and the Apps Script `CONFIG` |
| Low | Missing CSP header | No `Content-Security-Policy` header is set. | Add one in `next.config.ts` once the iframe and script inventory is stable |
| Low | Media uploads ephemeral | Payload writes media to `media/` at the project root, which Vercel wipes on deploy. See `docs/operations/storage.md`. | **BLOCKED-ON-BOBBY:** approve or decline a storage adapter before uploading media through `/admin` |
| Low | `middleware.ts` file convention | Next 16 deprecates the `middleware` file and export name in favor of `proxy` (`proxy.ts`, Node.js runtime). The build prints a deprecation warning. | Rename to `proxy.ts` and the function to `proxy`; confirm the cookie gate still works on `/account`, `/community`, `/courses` |
| Low | Public forms | `/api/interest-signups` and `/api/org-inquiry` have no CAPTCHA. | Add one if spam appears |

---

## Privacy

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | Cookie consent | No consent banner. GA4 sets cookies. | **BLOCKED-ON-BOBBY:** confirm whether a consent banner is required for the launch audience |
| Low | GA4 data processing agreement | A Google DPA should be in place if EU traffic is expected. | **BLOCKED-ON-BOBBY:** confirm with legal counsel |

---

## Mobile

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | Services hero video | `public/videos/paths-loop.mp4` fails to decode in Chrome (non-faststart encoding) and renders as a black box. | **BLOCKED-ON-BOBBY:** re-export with `-movflags +faststart` |
| Low | Teen page pinned CTA | The Cal.com popup on the Teen page's pinned CTA is untested on small screens. The Teen mosaic is not wired. | Test on mobile before wiring `TeenRebellionRoute` |

---

## Performance

| Severity | Area | Finding | Action |
|---|---|---|---|
| High | Redirect chain | `bobby-washburn.com` and `www.bobby-washburn.com` redirect to each other before serving, costing about 1.6 s per load. See `docs/operations/lighthouse.md`. | **BLOCKED-ON-BOBBY:** in Vercel domain settings, pick one canonical host with a single 301 from the other |
| Low | Recharts bundle | Recharts adds about 150 KB to `/docs/adhd`. | Lazy-load with `next/dynamic` if needed |
| Low | `text-primary` contrast | Lighthouse flagged `#9F0000` small text on some surfaces. | Audit surfaces and adjust small text |

---

## Accessibility

| Severity | Area | Finding | Action |
|---|---|---|---|
| Medium | ADHD interactive components | `DelayAversionSlider`, `EvidenceTierToggle`, `StrategyExplorer` keyboard and screen reader behavior not audited. | **BLOCKED-ON-BOBBY:** manual test before promoting `/docs/adhd` |
| Low | Tech Safety wizard | Focus management between steps not audited. | Keyboard-only test |
| Low | Services flip cards | `ModalityCards` at `sm`+: keyboard focus into the card back not confirmed. | Keyboard-only test |

---

## Not covered by code review (requires Bobby's environment)

- Auth flow end-to-end (sign-up, email verification, password reset, Google OAuth)
- Course end-to-end (create a course, enroll, complete a lesson)
- Community end-to-end (post, comment, report)
- Apps Script verification list: not in the repo; Bobby confirms or shares it
