"use client";
import { type ChangeEvent, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { api } from "~/trpc/react";

export function PlanPrat() {
  const [error, setError] = useState("");
  const [text, setText] = useState<string>("");
  const [chatItems, setChatItems] = useState<
    { text: string; isUser: boolean }[]
  >([]);
  const utils = api.useUtils();

  async function queryPlanprat(queryInput: string) {
    try {
      const response = await utils.planprat.fetchResponse.fetch({
        query: queryInput,
      });

      return response;
    } catch (error) {
      console.error(error);
      setError("Error: Failed to retrieve response.");
    }
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value); // Update state with textarea input
  };

  const handleSubmit = async (): Promise<void> => {
    if (text.trim()) {
      setChatItems((prevChatItems) => [
        { text: text, isUser: true },
        ...prevChatItems,
      ]); //question
      const sendText = text;
      setText("");
      const response = await queryPlanprat(sendText);
      if (!response) return;
      setChatItems((prevChatItems) => [
        { text: response.answer, isUser: false },
        ...prevChatItems,
      ]);
    }
  };

  const handleKeyDown = async (
    e: KeyboardEvent<HTMLTextAreaElement>,
  ): Promise<void> => {
    if (e.key === "Enter") {
      e.preventDefault();
      await handleSubmit();
    }
  };
  return (
    <div className="bg-white p-10">
      <section className="rounded-lg shadow-lg">
        <h1 className="w-full rounded-lg bg-kartAI-blue pb-6 pt-1 text-center text-white">
          PlanPrat
        </h1>
        <div id="planprat-input-output" className="relative w-full p-2">
          <ul
            id="planprat-output "
            className="flex h-96 w-full flex-col-reverse overflow-y-auto rounded-lg p-2 shadow-inner"
          >
            {chatItems.map((chatItem, index) => (
              <li
                data-cy="chat-output"
                className={
                  chatItem.isUser
                    ? "m-2 ml-6 self-end rounded-lg border-2 p-2 text-black shadow-lg"
                    : "m-2 mr-6 self-start rounded-lg bg-kartAI-blue p-2 text-white shadow-lg"
                }
                key={index}
              >
                {chatItem.text}
              </li>
            ))}
          </ul>
          <textarea
            id="planprat-input"
            className="mt-2 w-full rounded-lg p-2 pr-12 text-black shadow-inner"
            placeholder="Still meg et spørsmål ..."
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button
            type="submit"
            id="planprat-input-button"
            className="absolute bottom-8 right-4 rounded"
            onClick={handleSubmit}
          >
            <Image
              src="/Ikoner/Dark/SVG/Comment.svg"
              alt="send"
              height="30"
              width="30"
              className="rounded bg-kartAI-blue p-1 text-white"
            ></Image>
          </button>
        </div>
        <p className="py-4 text-center text-red-500">{error}</p>
      </section>
    </div>
  );
}
