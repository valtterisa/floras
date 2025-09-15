import { Horizontal, Vertical } from "@/components/layout/panels";
import { TabContent, TabItem } from "@/components/tabs";
import { Chat } from "./chat";
import { Preview } from "./preview";

export default async function EditorPageClient() {
  return (
    <>
      <div className="flex flex-col h-screen max-h-screen overflow-hidden p-2 space-x-2">
        <ul className="flex space-x-5 font-mono text-sm tracking-tight px-1 py-2 md:hidden">
          <TabItem tabId="chat">Chat</TabItem>
          <TabItem tabId="preview">Preview</TabItem>
        </ul>

        {/* Mobile layout tabs taking the whole space*/}
        <div className="flex flex-1 w-full overflow-hidden pt-2 md:hidden">
          <TabContent tabId="chat" className="flex-1">
            <Chat className="flex-1 overflow-hidden" />
          </TabContent>
          <TabContent tabId="preview" className="flex-1">
            <Preview className="flex-1 overflow-hidden" />
          </TabContent>
        </div>

        {/* Desktop layout with horizontal and vertical panels */}
        <div className="hidden flex-1 w-full min-h-0 overflow-hidden pt-2 md:flex">
          <Horizontal
            defaultLayout={[50, 50]}
            left={<Chat className="flex-1 overflow-hidden" />}
            right={
              <Vertical
                defaultLayout={[70, 15, 15]}
                top={<Preview className="flex-1 overflow-hidden" />}
                middle={undefined}
                bottom={undefined}
              />
            }
          />
        </div>
      </div>
    </>
  );
}
