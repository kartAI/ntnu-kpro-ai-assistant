"use client"
import { type ChangeEvent, useState, type KeyboardEvent } from "react";
import Image from "next/image";

interface PlanpratRespons {
    answer: string;
}
async function queryPlanprat(query: string): Promise<PlanpratRespons> {
    const payload = {
        "query": query

    }
    const response = await fetch('http://localhost:8000/plan-prat/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json", 
        },
    })
  
    if (!response.ok) {
      throw new Error('Failed to upload files');
    }
  
    return response.json() as Promise<PlanpratRespons>;
  }

export function PlanPrat() {
    const [text, setText] = useState<string>('');
    const [chatItems, setChatItems] = useState<{ text: string; isUser: boolean }[]>([]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
      setText(e.target.value); // Update state with textarea input
    };
  
    const handleSubmit = async (): Promise <void> => {
      
      if (text.trim()) {
        setChatItems((prevChatItems) => [{ text: text, isUser: true }, ... prevChatItems ]); //question
        const sendText = text
        setText("")
        const response = await queryPlanprat(sendText)
        setChatItems((prevChatItems) => [{text: response.answer, isUser: false}, ... prevChatItems]) //response TODO: query planprat
      }
    };

    const handleKeyDown = async(e: KeyboardEvent<HTMLTextAreaElement>): Promise<void> => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevents creating a new line in the textarea
          await handleSubmit(); // Calls handleSubmit when Enter is pressed
        }
      };
    return(
        <div className="bg-white p-10">
            <section className="rounded-lg shadow-lg ">
                <h1 className="bg-kartAI-blue text-white text-center rounded-lg pb-6 pt-1 w-full">PlanPrat</h1>
                <div id="planprat-input-output" 
                    className="p-2 w-full relative">    
                    <ul id="planprat-output " 
                        className="overflow-y-auto h-96 w-full shadow-inner rounded-lg p-2 flex flex-col-reverse">
                            {chatItems.map((chatItem, index) => (
                                <li className={chatItem.isUser? 
                                    "rounded-lg m-2 shadow-lg border-2 p-2 text-black self-end ml-6" : "bg-kartAI-blue text-white rounded-lg m-2 shadow-lg p-2 self-start mr-6"} 
                                key={index} 
                                    >{chatItem.text}</li>
                            ))}
                    </ul>
                    <textarea id="planprat-input" 
                        className="w-full mt-2 p-2 pr-12 shadow-inner rounded-lg text-black" 
                        placeholder="Still meg et spørsmål ..."
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}>
                    </textarea>
                    <button id="planprat-input-button"
                        className="absolute right-4 bottom-8 rounded "
                        onClick={handleSubmit}>
                        <Image src="/Ikoner/Dark/SVG/Comment.svg" alt="send" height="30" width="30" className=" text-white bg-kartAI-blue p-1 rounded" ></Image>
                    </button>
                </div>
            </section>
        </div>
        
    )
    
}