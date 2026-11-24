# FindIt Campus Hub – AI Tools & Prompt Engineering Record

## 1. AI Tools Used

Three AI tools were used during the development of this project.

| AI Tool | Contribution |
|---|---|
| Lovable | Generated the initial website frontend using the original project prompt. |
| ChatGPT | Assisted with development, debugging, Supabase integration, Groq API integration, chatbot implementation and testing. |
| Google Gemini | Reviewed the project concept, suggested test cases and identified potential security and chatbot improvements. |

**Note:** These contributions describe how the tools were actually used. Gemini was used for review and recommendations, not for directly writing or modifying the project code.

## 2. Initial Project Prompt

The complete original prompt used to generate the initial website with Lovable is saved separately in:

`docs/initial-prompt.md`

It contains the following five prompt elements:

1. **Role:** Professional UI/UX designer and frontend developer.
2. **Task:** Create the FindIt Campus Lost & Found website.
3. **Context:** Help college students report lost and found belongings through a centralized platform.
4. **Constraints:** Responsive design, premium interface, reusable React components and functional navigation.
5. **Output Format:** Clean and organized React code.

## 3. Prompt Engineering Techniques

The following techniques were used or explored during development:

- **Role-based prompting:** Assigning a specific role to guide the AI's response.
- **Context-based prompting:** Providing project details and explaining the campus lost-and-found problem.
- **Step-by-step prompting:** Breaking development and debugging tasks into smaller steps.
- **Constraint-based prompting:** Specifying requirements such as using database records and avoiding invented item information.
- **Refinement:** Improving prompts when chatbot responses or search results needed improvement.
- **Testing and evaluation:** Using test cases to evaluate chatbot responses.

## 4. Chatbot Prompt Improvements

The FindIt AI Assistant was designed to:

- Answer questions using the active lost-and-found item records supplied to it.
- Distinguish between lost-item and found-item reports.
- Avoid inventing item records or claiming that an unreported item exists.
- Provide relevant item details and locations.
- Include item references that can open the corresponding item detail page.
- Handle questions where no matching item is available.

## 5. Google Gemini Contribution

Google Gemini was used to review the chatbot and suggest test scenarios, including:

- Searching with spelling mistakes.
- Searching for items using different descriptions.
- Checking location-based queries.
- Testing inactive item reports.
- Testing invalid or unrelated questions.
- Checking prompt-injection handling.

These suggestions helped identify areas for further testing and improvement.

## 6. Development Evidence

The following evidence should be maintained for the final project submission:

- Original Lovable prompt.
- Screenshots of the initial Lovable-generated website.
- ChatGPT development and debugging conversations.
- Google Gemini review and test-case screenshots.
- Chatbot testing results.
- Screenshots of the final working website.

## 7. Conclusion

AI tools supported different stages of FindIt Campus Hub development. Lovable helped generate the initial frontend, ChatGPT assisted with implementation and debugging, and Google Gemini contributed project review and testing suggestions.

Prompt refinement and testing were used to improve the website and its AI Assistant.