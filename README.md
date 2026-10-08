# Alexa's Reading List — deploy guide

This is a ready-to-deploy static website with a public reading list (`index.html`) and a private editor (`admin.html`). It connects to the Supabase project configured in `config.js`.

## 1. Verify your database

Your Supabase SQL Editor should already have created `public.books` and `public.site_admins`, enabled RLS, and added the policies from our conversation. Confirm `The Culture Map` appears in Table Editor > books. Confirm the UID of your Supabase Auth user exists in `site_admins`. Do NOT disable RLS or put a secret/service-role key in `config.js`.

Important: the public website reads `books` using the publishable key. Editing requires signing in with your Supabase Auth email/password AND having your UID in `site_admins`. The site_admins table does not need a public read policy. Its existing RLS allows the auth user to query their own admin membership only if you add the policy below:

```sql
create policy "Users can check own admin membership"
on public.site_admins for select to authenticated
using (user_id = (select auth.uid()));
```

Run that SQL **once** in Supabase SQL Editor before signing into the dashboard. If the policy already exists, don't run it again. No insert/update/delete policies are needed on site_admins.

## 2. Upload the website to GitHub

1. Create a new **public** repository at https://github.com/new, named `reading-list`.
2. Choose **Add file > Upload files** and drag all website files from the unzipped folder (not the ZIP itself) into the repository root.
3. Click **Commit changes**.

## 3. Publish using Vercel

1. Visit https://vercel.com/new and sign in with GitHub.
2. Import your `reading-list` repository and grant Vercel access if requested.
3. Choose Framework Preset **Other** (plain HTML/CSS/JS). Root directory `./`. No build command or environment variables needed.
4. Click **Deploy**. Your website will be available at a `*.vercel.app` URL.
5. Open the Vercel URL. The public list should display The Culture Map.
6. Open `https://YOUR-VERCEL-URL/admin.html`, sign in with the Supabase Auth account you created, and add or edit a book.

## 4. Optional book covers

In the editor, paste a direct HTTPS URL for the book cover. If no URL is provided, a minimal placeholder appears. Avoid links to websites that forbid embedding or reuse. Book covers may be subject to copyright.

## Troubleshooting

- **Public list says unable to load**: verify Supabase URL/key in `config.js`, your books table, public SELECT policy, and that RLS is enabled.
- **Login works but admin says not registered**: verify `site_admins` has the correct Auth UID and the own-admin-membership SELECT policy above exists.
- **Login fails**: check the user is created and email confirmed under Supabase Authentication > Users.
- **Images don't appear**: use a direct HTTPS image URL and check whether the host allows embedding.
- **Vercel 404**: make sure `index.html` and `admin.html` are in the repository root, not inside an extra folder.

The publishable key is intentionally public. Never upload your database password or Supabase service-role/secret key. Anyone with your public link can view the public reading list; only a designated admin can change books.
