# Skillies.AI · Backend activation guide

The auth + student portal + admin panel code is already in the repo.
All that's left is **pasting in keys** from three services. You can
do each piece at a time.

Timeline:

| Service | How long | What blocks without it |
|---|---|---|
| **Supabase** · project + schema | ~10 min | `/login`, `/learn`, `/admin` won't work until this is done |
| **MSG91** · SMS provider | ~20 min (after KYC) | Login will fail — OTP can't be delivered |
| **Cloudflare Stream** · video | ~5 min | Lesson pages show the "Recording in progress" placeholder instead of a player |

## 1. Supabase · auth + database

### 1a. Create the project

1. Go to [supabase.com](https://supabase.com) → **Sign up with GitHub**
2. **New Project**:
   - Name: `skillies`
   - Database password: click "Generate" → save in password manager
   - Region: **Asia-Pacific · ap-south-1 (Mumbai)**
   - Plan: Free
3. Wait ~2 min for provisioning.

### 1b. Run the schema

1. In the Supabase dashboard → **SQL Editor** → New Query
2. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Paste → hit **Run**
4. Verify tables exist: dashboard → **Table Editor** → you should see
   `profiles`, `courses`, `lessons`, `enrollments`, `lesson_progress`.

### 1c. Enable phone auth

1. Dashboard → **Authentication** → **Providers** → toggle **Phone** on
2. Under SMS provider, choose **MSG91** (cheaper for India) — configured
   in step 2 below. For now leave it; the section won't save until you
   paste MSG91 credentials.

### 1d. Get your keys

1. Dashboard → **Project Settings** (gear icon, bottom left) → **API**
2. Copy three values:
   - **Project URL** (e.g. `https://abcdef.supabase.co`) — paste to
     Ehsan / Claude or add directly in Vercel
   - **anon public key** (long `eyJ…` string) — paste to Ehsan / Claude
     or add directly in Vercel
   - **service_role key** (different `eyJ…`, marked secret) — **never
     paste in chat**; add directly in Vercel env vars

### 1e. Add the keys to Vercel

1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add three variables (apply to Production + Preview + Development):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | the anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role key (secret) |

3. Hit **Save** → **redeploy** the latest deployment from the Deployments tab
4. Site now has a working login + portal skeleton. It's ready the
   moment MSG91 (below) is live.

### 1f. Mark yourself as admin

Once the schema is running, you need to mark your own phone as admin
so you can access `/admin`:

1. Supabase dashboard → **Authentication** → **Users** → **Add user** → **Create new user** with your own phone + a password (you won't use the password; just need the user to exist)
2. Copy the user's UUID
3. Supabase dashboard → **SQL Editor** → run:
   ```sql
   update public.profiles
   set is_admin = true, full_name = 'Ehsan Asgar P'
   where id = '<paste-your-uuid>';
   ```
4. Now you can visit `/admin` after logging in.

## 2. MSG91 · the SMS provider

Supabase's default SMS provider (Twilio) costs ~₹5 per OTP.
MSG91 costs ~₹0.18 per OTP in India. Worth the extra setup.

### 2a. Sign up

1. [msg91.com/signup](https://msg91.com/signup) — free account
2. Complete KYC (DLT registration for India SMS — takes 1–3 business
   days to approve). You'll need your PAN and address proof.
3. Once approved, top up ₹100 (~550 OTPs).

### 2b. Create a template

MSG91 requires every SMS template to be DLT-registered. Supabase provides
the OTP template — you register it via the MSG91 dashboard:

1. MSG91 dashboard → **Flow** → **Create Flow** → Type: Transactional
2. Template text:
   ```
   Your Skillies.AI verification code is {{otp}}. Valid for 10 minutes.
   Do not share.
   ```
3. Get a DLT entity ID from your telecom registrar (Jio Truecaller or similar) — this is the slowest step in India, follow MSG91's wizard.
4. Once DLT-approved, note your **Template ID** and **Sender ID**.

### 2c. Wire to Supabase

1. Supabase dashboard → **Authentication** → **Providers** → **Phone** → **SMS provider: MSG91**
2. Paste your **Auth Key** (MSG91 dashboard → Profile → **Auth Key**)
3. Paste the **Sender ID** + **Template ID** from step 2b
4. Save.

Test: go to `skillies.ai/login`, enter your own phone, you should
receive an SMS within 10 seconds.

## 3. Cloudflare Stream · course video hosting

You already have Cloudflare for DNS. Enable Stream on the same account.

### 3a. Subscribe

1. Cloudflare dashboard → left sidebar → **Stream** → **Subscribe**
2. $5/month + small usage fees. Billing goes on your existing Cloudflare
   payment method.

### 3b. Get your customer code

1. Cloudflare dashboard → **Stream** → any video → the embed URL looks like
   `https://customer-XXXXXX.cloudflarestream.com/<video-uid>/iframe`
2. Copy the `XXXXXX` part (your customer code).
3. Add to Vercel env vars:
   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_CF_STREAM_CUSTOMER_CODE` | `XXXXXX` |

### 3c. Upload a lesson video

1. Cloudflare dashboard → **Stream** → **Upload** → drag the MP4
2. Wait for encoding (usually 1-2× the video length)
3. Copy the **Video ID** (a long hex string like `abc123def456…`)
4. In Supabase SQL Editor, insert the lesson:
   ```sql
   insert into public.lessons (course_id, day, title, description, video_id, duration_seconds, is_published)
   values (
     'kdp-mastery',
     1,                          -- day
     'Your welcome call',
     '30-min onboarding with your mentor. Map your niche, pick your first book, align on the 50-day arc.',
     'abc123def456…',            -- paste video UID from Cloudflare
     1800,                       -- 30 min
     true
   );
   ```
5. Refresh `/learn/kdp-mastery/1` → the video player appears.

Repeat for Day 2, 3, … as you record each lesson.

## 4. Testing the end-to-end flow

Once all three services are wired:

1. **Enrol yourself as a test student**
   - Sign in to Supabase SQL Editor:
     ```sql
     -- Find your user id by phone
     select id from public.profiles where phone = '+919999999999';
     -- Enrol yourself in KDP Mastery
     insert into public.enrollments (user_id, course_id, tier)
     values ('<your-uuid>', 'kdp-mastery', 'standard');
     ```
   - OR, easier: visit `skillies.ai/admin`, type your phone, click Enrol.

2. **Log in**
   - Visit `skillies.ai/login` → enter your phone → receive OTP → enter it
   - You should land on `/learn` showing your enrolled course.

3. **Watch a lesson**
   - Click the course → click any published lesson → the video plays.

4. **Check progress**
   - Watch past 90% → Supabase `lesson_progress` should have a row for
     your user + that lesson with `completed = true`.

## 5. What happens next

- **Founding batch (6 students):** use `/admin` to enrol each by phone.
  Send them `skillies.ai/login` via WhatsApp. They log in with OTP.
- **Open enrollment (next cohort):** plug in Razorpay checkout. When
  payment succeeds, Razorpay's webhook hits our API and auto-creates
  the enrollment. (Separate build — not in this commit.)

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| Login page shows "SMS provider not configured" | Complete MSG91 setup (section 2). Verify credentials saved in Supabase. |
| Login succeeds but `/learn` redirects to `/login` in a loop | Middleware thinks the session didn't stick. Check Vercel env vars were added to **all** environments (Production, Preview, Development). Redeploy. |
| `/admin` redirects to `/learn` | Your profile doesn't have `is_admin = true`. Run the SQL in 1f again. |
| Lesson video says "Recording in progress" forever | `video_id` on the lesson is null. Check `select * from public.lessons` and make sure the Cloudflare UID is populated. |
| Can't create a user via `/admin` | `SUPABASE_SERVICE_ROLE_KEY` is missing or wrong in Vercel env. |

---

*Last updated 2026-04-20 · questions: Ehsan Asgar P · [WhatsApp](https://wa.me/918089941131)*
