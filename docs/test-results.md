# FindIt Campus Hub – Chatbot Testing Results

## 1. Testing Overview

The AI Assistant was tested using different lost-and-found queries to evaluate item matching, spelling correction, location-based searches and responses when no matching report exists.

## 2. Test Cases Executed

| Test ID | User Query | Actual Result | Status |
|---|---|---|---|
| TC-01 | I lost my blue Milton water bottle. | Found a matching Milton bottle report at the Sports Complex. The item detail link opened correctly. | Pass |
| TC-02 | I found a silver Casio watch. Has anyone reported losing it? | No matching Casio watch report was found. | Pass |
| TC-03 | Lost my blak lether wallet near canteen. | Assistant identified the Black Leather Wallet report and corrected the spelling. Its location suggestion was not fully verified. | Partial Pass |
| TC-04 | Did anyone find a lenvo laptop charg?r? | No matching laptop charger report was found. | Inconclusive |
| TC-05 | I misplaced my AirPods case. | No matching AirPods case report was found. | Inconclusive |
| TC-06 | I lost my wallet near Academic Block A. Has anyone found it? | Assistant identified the Black Leather Wallet report at Academic Block A. | Pass |

## 3. Testing Observations

- The chatbot successfully retrieved relevant item reports in matching cases.
- Item detail links worked correctly during testing.
- The assistant handled spelling mistakes in the wallet query.
- No matching reports were returned for some queries.
- Location suggestions should be based only on verified report information.
- More testing is required for ambiguous descriptions and different item names.

## 4. Conclusion

The chatbot successfully handled several basic lost-and-found queries using active item records. Testing also identified areas for improvement, particularly location accuracy and matching items described with different names.

**Note:** Inconclusive tests do not prove that the chatbot failed. No matching database records were available to confirm those scenarios.