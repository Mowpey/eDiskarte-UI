import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  Image,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Modal,
  Animated,
  Dimensions,
  ScrollView
} from 'react-native';
import { 
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Send,
  Phone,
  Video,
  Info,
  AlertCircle,
  Bell,
  X,
  Trash2,
  UserX,
  Flag,
  Check,
  XCircle,
  User
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Message = {
  id: string;
  text: string;
  time: string;
  type: 'sent' | 'received';
  senderPic?: string;
};

type ChatProps = {
  recipientId?: string;
  recipientName?: string;
  recipientPic?: string;
  chatRequestStatus?: 'pending' | 'accepted' | 'rejected';
};

const ChatScreen: React.FC<ChatProps> = ({ 
  recipientId = '1',
  recipientName = 'Ken Robbie Galapate', 
  recipientPic = 'https://randomuser.me/api/portraits/men/1.jpg',
  chatRequestStatus = 'pending'
}) => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [chatStatus, setChatStatus] = useState(chatRequestStatus);
  const [modalAnimation] = useState(new Animated.Value(0));
  
  const getPendingMenuOptions = () => [
    { icon: <User size={18} color="#777" />, label: 'View Profile' }
  ];
  
  const getAcceptedMenuOptions = () => [
    { icon: <Bell size={18} color="#777" />, label: 'Mute' },
    { icon: <Trash2 size={18} color="#777" />, label: 'Delete conversation' },
    { icon: <UserX size={18} color="#777" />, label: 'Block' }
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleMenuModal = () => {
    if (menuModalVisible) {
    
      Animated.timing(modalAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true
      }).start(() => setMenuModalVisible(false));
    } else {
      setMenuModalVisible(true);
     
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true
      }).start();
    }
  };

  const handleAcceptChat = () => {
    setChatStatus('accepted');
    
  };

  const handleRejectChat = () => {
    setRejectModalVisible(true);
  };

  const confirmRejectChat = () => {
    setChatStatus('rejected');
    setRejectModalVisible(false);
    
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const sendMessage = () => {
    if (inputMessage.trim().length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'sent',
      senderPic: 'https://randomuser.me/api/portraits/women/3.jpg'
    };
    
    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.type === 'sent' ? styles.sentMessageRow : styles.receivedMessageRow
    ]}>
      {item.type === 'received' && item.senderPic && (
        <Image 
          source={{ uri: item.senderPic }} 
          style={styles.senderAvatar} 
        />
      )}
      
      <View style={[
        styles.messageBubble,
        item.type === 'sent' ? styles.sentBubble : styles.receivedBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.type === 'sent' ? styles.sentMessageText : styles.receivedMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime,
          item.type === 'sent' ? styles.sentMessageTime : styles.receivedMessageTime
        ]}>
          {item.time}
        </Text>
      </View>
      
      {item.type === 'sent' && item.senderPic && (
        <Image 
          source={{ uri: item.senderPic }} 
          style={styles.senderAvatar} 
        />
      )}
    </View>
  );

  // Empty state component to show when no messages exist
  const renderEmptyChat = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubtext}>Send a message to start the conversation</Text>
    </View>
  );

  const modalScale = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const modalOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });


  const menuOptions = chatStatus === 'accepted' ? getAcceptedMenuOptions() : getPendingMenuOptions();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[
        styles.header, 
        Platform.OS === 'ios' ? styles.iosHeader : styles.androidHeader
      ]}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerUserInfo}>
          <Image 
            source={{ uri: recipientPic }} 
            style={styles.recipientAvatar} 
          />
          <Text style={styles.recipientName}>{recipientName}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={toggleMenuModal}
          style={styles.moreButton}
        >
          <MoreVertical size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      {chatStatus === 'pending' && (
        <View style={styles.requestBanner}>
          <Text style={styles.requestText}>
            Chat request from {recipientName}
          </Text>
          <View style={styles.requestActions}>
            <TouchableOpacity 
              style={styles.rejectButton}
              onPress={handleRejectChat}
            >
              <XCircle size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.acceptButton}
              onPress={handleAcceptChat}
            >
              <Check size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <Modal
        transparent
        visible={rejectModalVisible}
        animationType="fade"
        onRequestClose={() => setRejectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.rejectModalContainer}>
            <Text style={styles.rejectModalTitle}>Reject Chat?</Text>
            <Text style={styles.rejectModalText}>
              Are you sure you want to reject this chat request from {recipientName}?
            </Text>
            <View style={styles.rejectModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setRejectModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={confirmRejectChat}
              >
                <Text style={styles.confirmButtonText}>Yes, Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Modal
        transparent
        visible={menuModalVisible}
        animationType="none"
        onRequestClose={toggleMenuModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={toggleMenuModal}
        >
          <Animated.View 
            style={[
              styles.dropdownMenu,
              { 
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              }
            ]}
          >
            {menuOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.menuOption,
                  index === menuOptions.length - 1 ? styles.lastMenuOption : null
                ]}
                onPress={() => {
                  toggleMenuModal();
              
                }}
              >
                <View style={styles.menuOptionIcon}>
                  {option.icon}
                </View>
                <Text style={styles.menuOptionText}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
      
      <FlatList
        data={chatStatus === 'accepted' ? messages : []}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={chatStatus === 'accepted' ? renderEmptyChat : null}
      />
      
      {chatStatus === 'accepted' && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
          style={styles.inputContainer}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={24} color="#999" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Write a message..."
            value={inputMessage}
            onChangeText={setInputMessage}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              inputMessage.trim().length === 0 && styles.sendButtonDisabled
            ]}
            onPress={sendMessage}
            disabled={inputMessage.trim().length === 0}
          >
            <Send size={20} color="#fff" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
      
      {chatStatus === 'rejected' && (
        <View style={styles.rejectedContainer}>
          <AlertCircle size={50} color="#ff3b30" />
          <Text style={styles.rejectedText}>
            You've rejected this chat request
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    zIndex: 10,
  },
  iosHeader: {
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
  },
  androidHeader: {
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moreButton: {
    padding: 8,
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  sentMessageRow: {
    justifyContent: 'flex-end',
  },
  receivedMessageRow: {
    justifyContent: 'flex-start',
  },
  senderAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 8,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 18,
    maxWidth: '70%',
  },
  sentBubble: {
    backgroundColor: '#0b216f', 
    borderBottomRightRadius: 5,
  },
  receivedBubble: {
    backgroundColor: '#e9e9eb', 
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  sentMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedMessageTime: {
    color: '#8e8e93',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    marginBottom: Platform.OS === 'ios' ? 0 : 0,
    paddingBottom: Platform.OS === 'android' ? 55 : 55,
  },
  attachButton: {
    padding: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0b216f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#b0c0e0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 15,
    width: SCREEN_WIDTH * 0.6, 
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastMenuOption: {
    borderBottomWidth: 0,
  },
  menuOptionIcon: {
    marginRight: 12,
  },
  menuOptionText: {
    fontSize: 16,
    color: '#333',
  },
  requestBanner: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  acceptButton: {
    backgroundColor: '#34c759', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
  },
  rejectButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 5,
  },
  rejectModalContainer: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rejectModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rejectModalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  rejectModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  rejectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rejectedText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 15,
  },
  // Empty chat state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  }
});

export default ChatScreen;