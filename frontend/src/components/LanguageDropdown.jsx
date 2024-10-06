import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';

const languageOptions = [
  { key: 'vn', label: 'Vietnamese' },
  { key: 'en', label: 'English' },
  { key: 'kr', label: 'Korean' },
];

const styles = StyleSheet.create({
  // Add your styles for the dropdown component
  dropdownButton: {
    backgroundColor: '#FFF', // Replace with your color
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD', // Replace with your color
  },
  dropdownText: {
    fontSize: 16, // Replace with your size
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 20,
  },
  optionButton: {
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16, // Replace with your size
  },
  // ... other styles
});

export const LanguageDropdown = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languageOptions[1]); // Default to English

  const selectLanguage = (option) => {
    setSelectedLanguage(option);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedLanguage.label}</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <TouchableOpacity style={styles.modalContainer} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={languageOptions}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionButton} onPress={() => selectLanguage(item)}>
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.key}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
