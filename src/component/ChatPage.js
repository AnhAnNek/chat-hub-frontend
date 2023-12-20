import ConversationHeader from "./ConversationHeader";
import ConversationList from "./ConversationList";
import ConversationSearchBar from "./ConversationSearchBar";
import MessageHeader from "./MesageHeader";
import MessageArea from "./MessageArea";
import MessageInputTool from "./MessageInputTool";

const ChatPage = () => {
    return (
      <div className="flex flex-wrap h-full">
        <div className="w-full md:w-1/3 bg-gray-400 p-4 h-full">
          <ConversationHeader/>
          <ConversationSearchBar/>
          <ConversationList/>
        </div>

        <div className="w-full md:w-2/3 p-4 h-full">
          <MessageHeader/>
          <MessageArea/>
          <MessageInputTool/>
        </div>
      </div>
    );
}

export default ChatPage;