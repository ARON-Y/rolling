import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Card from './Card';
import HeaderService from './HeaderService';
import api from '../api/axios';
import Toast from './Toast';
import MessageDialog from './MessageDialog';

const Detail = () => {
  const { id } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [recipientMessages, setRecipientMessages] = useState(null);
  const [reactions, setReactions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const backgroundColorSheet = {
    begie: 'bg-beige-200',
    purple: 'bg-purple-200',
    blue: 'bg-blue-200',
    green: 'bg-green-200',
  };

  const fetchRecipientData = async () => {
    try {
      const recipientResponse = await api.getRecipients('13-2', id);
      const recipientMessagesResponse = await api.getRecipientsMessages('13-2', id);
      setRecipient(recipientResponse.data);
      setRecipientMessages(recipientMessagesResponse.data.results);
    } catch (e) {
      console.error('API 호출 중 오류 발생:', e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipientReactionsData = async () => {
    try {
      const recipientReactions = await api.getRecipientsReactions('13-2', id);
      setReactions(recipientReactions.data);
    } catch (e) {
      console.error('API 호출 중 오류 발생:', e);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRecipientData();
      fetchRecipientReactionsData();
    }
  }, [id]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>오류 발생: {error.message}</p>;

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 5000);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const openMessage = (message) => {
    setSelectedMessage(message);
    showDialog();
  };

  return (
    <div className={`w-full h-screen ${backgroundColorSheet[recipient.backgroundColor]}`}>
      <HeaderService
        recipient={recipient}
        messages={recipientMessages}
        reactions={reactions}
        id={id}
        toastVisible={showToast}
        onUpdate={fetchRecipientReactionsData}
      />
      <Card messages={recipientMessages} openMessage={openMessage} />
      {toastVisible && <Toast hideToast={hideToast} />}

      <MessageDialog
        showDialog={dialogVisible}
        hideDialog={hideDialog}
        selectedMessage={selectedMessage}
      />
    </div>
  );
};

export default Detail;
