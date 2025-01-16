import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";

export interface MnemonicInputProps {
  words: string[];
  setWords?: (words: string[]) => void;
  verifyIndices?: number[];
  mode: "import" | "readonly" | "verify";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  wordContainer: {
    flex: 1,
    marginHorizontal: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 4,
    borderRadius: 4,
    backgroundColor: "#e9e9e9",
  },
  wordInputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  index: {
    width: 20,
  },
  missingWord: {
    backgroundColor: "#e9e9e9",
    borderColor: "#ff6b6b",
  },
  wordText: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 20,
    height: 35,
    textAlign: "center",
  },
});

export default function MnemonicInput({
  words,
  setWords,
  mode,
  verifyIndices: missingIndices,
}: MnemonicInputProps) {
  const handleWordChange = (text: string, index: number) => {
    const updatedWords = [...words];
    updatedWords[index] = text;
    setWords?.(updatedWords);
  };

  const renderWord = (word: string, index: number) => {
    const isMissing = missingIndices?.includes(index);
    const isEditable = mode === "import" || (mode === "verify" && isMissing);
    return (
      <View
        key={index}
        style={[
          styles.wordContainer,
          isEditable && styles.wordInputContainer,
          isMissing && styles.missingWord,
        ]}
      >
        <Text style={styles.index}>{index + 1}.</Text>
        {isEditable ? (
          <TextInput
            style={[styles.wordText]}
            value={word}
            onChangeText={(text) => handleWordChange(text, index)}
            editable={true}
          />
        ) : (
          <Text style={styles.wordText}>{word}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        renderItem={({ item, index }) => renderWord(item, index)}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}
