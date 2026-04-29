# Decision Log

## 1. Time Breakdown

I didn’t track exact time, but overall it took me around 1.5 hours.

I spent some time setting up the project and building the basic APIs.
Then I worked on the AI feature and fixed issues with its output.
The remaining time went into cleaning up and writing the README.

---

## 2. Where AI Was Used — and Why

I used AI for basic setup like Express structure and some boilerplate code.

I also used it to help with the prompt for the priority feature.

Mostly used AI to save time on simple tasks.

---

## 3. Where AI Was NOT Used — and Why

I decided the overall structure myself.

I chose SQLite because it’s simple and enough for this task.

I handled validation and fallback manually because AI output is not always reliable.

---

## 4. Bad AI Outputs

Sometimes the AI didn’t return proper JSON and added extra text.

I fixed this by extracting only the JSON part before parsing.

Also, sometimes it returned invalid priority values.

I handled this by defaulting to “medium” if the value is not valid.

---

## 5. Trade-offs Made

I used SQLite instead of a full database to keep things simple.

I didn’t use any ORM since it wasn’t needed.

I kept the AI call inside the request even though it adds some delay, because it was easier to implement.

I didn’t add extra features since they were not required.

---

## 6. What I Would Improve With More Time

I would add better input validation.

I would also add tests.

And improve error handling for the AI part.

---
