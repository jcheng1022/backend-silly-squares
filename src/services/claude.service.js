import {anthropic} from "../server";


class ClaudeService {

    static async askClaude(payload){

        try {
            console.log(`Asking Claude...`)
            const msg = await anthropic.messages.create({
                model: "claude-3-5-sonnet-20240620",
                system: "You are a software engineer who is highly proficient at considering edge cases for code and writing unit tests using jest. Given a code snippet, list out edge cases and write the code for each edge case. Return this list as JSON, with keys: 'tests'(array of objects, each object with keys of 'test'(the test code), and 'explanation'(the explanation). You may be provided the overall intended purpose of the code snippet, but if it is not provided, do your best to understand the intended purpose based on the provided code. ",
                // system: "Given a job description and resume, please construct a one page cover letter with a minimum of 400 words explaining why this person would be a good fit for the role described in the job description. Utilize any similarities in job description and resume to build a stronger argument for this opportunity, but make sure to not state that the user is proficient or strong in certain skills listed in job description if it is not part of their resume. Begin with a short introduction, built using the resume information. Then explain with detail and keywords taken from the job description, on why this person would be a good fit and provide value. Lastly, express gratitude for the reader's time and provide a method of communication such as \"feel free to contact me at this email\" and include the user's email if provided. The result should be three paragraphs, no bullet points or other symbols. ",
                max_tokens: 2048 ,
                messages: [{
                    role: "user",
                    content:payload
                    // content:`Here is the codeSnippet:console.log(\"Hello World\")\n\nconst testThis = (firstNum = 1, secondNum = 2) => {\n    \n    return firstNum + secondNum\n}" `
                }]
            });

            console.log(`Claude finished!`)

            const jsonMatch = msg.content[0].text.match(/{[\s\S]*}/);

            if (jsonMatch) {
                const jsonString = jsonMatch[0];

                try {
                    // Parse the JSON string into an object
                    const jsonObject = JSON.parse(jsonString);
                    return jsonObject?.tests
                } catch (error) {
                    console.error("Failed to parse JSON:", error);
                }
            } else {
                console.error("No JSON found in the string.");
            }
            return msg.content[0].text
        } catch (e) {
            throw e
        }


    }


}


export default ClaudeService
