import { useChatStore } from "../store/useChatStore";

import NoChatSelected from "../components/Sidebar/NoChatSelected";
import ChatContainer from "../components/ChatContainer/ChatContainer";
import Sidebar from "../components/Sidebar/Sidebar";

const Home = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen">
      <div className="flex items-center justify-center h-full px-0">
        <div className="rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-2rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;