<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Item data: pure types/helpers and sample items in `src/data/items.ts`; public reads go through server functions in `src/data/items.functions.ts` (publishable key, RLS decides) via `src/data/items-queries.ts`; report saving runs in the browser as the signed-in user in `src/data/submit-report.ts`. Sample items show only when the database has no active reports (`chooseItems`), so real data always wins.
- Photos go to the `item-photos` bucket under `<user_id>/…`; storage rules only allow writes inside the uploader's own folder.
- Session state comes from the single listener in `src/components/site/AuthProvider.tsx` (`useAuth`); never add per-page auth listeners.
- Page sections are reusable components under `src/components/{site,home,items,assistant}`; routes in `src/routes` only compose them and set `head()`.
- Assistant replies come from `src/components/assistant/replies.ts` as a placeholder; the Gemini integration should replace `getAssistantReply` without changing `ChatPanel`.
- Colours, gradients and shadows are tokens/utilities in `src/styles.css`; components use those (e.g. `bg-gradient-navy`, `text-lost`, Button `hero`/`lost`/`found` variants), never raw colour classes.
