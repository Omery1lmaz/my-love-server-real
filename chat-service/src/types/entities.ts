export interface IChat {
  _id: string;
  participants: string[];
  lastMessage: {
    text: string;
    sender: string;
    createdAt: Date;
  };
}

export interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  text: string;
  createdAt: Date;
  readBy: string[];
} 