import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const NominatimSearchUrl = "https://nominatim.openstreetmap.org/search?";

const GoogleTextInput = ({
  icon,
  initialLocation,
  textInputBackgroundColor,
  containerStyle,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const fetchSuggestions = async (text) => {
    setQuery(text);

    // Hide suggestions if the input is empty
    if (text.length === 0) {
      setSuggestions([]);
      return;
    }

    if (text.length > 2) {
      try {
        const response = await fetch(
          `${NominatimSearchUrl}q=${text}&format=json&addressdetails=1`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }
  };

  const handleSelection = (item) => {
    setQuery(item.display_name);
    setSuggestions([]);
    handlePress({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      address: item.display_name,
    });
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <Image
          source={icon ? icon : icons.search}
          style={styles.icon}
          resizeMode="contain"
        />
        <TextInput
          value={query}
          onChangeText={(text) => fetchSuggestions(text)}
          style={[
            styles.textInput,
            { backgroundColor: textInputBackgroundColor || "white" },
          ]}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
      {isFocused && query.length > 0 && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          style={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelection(item)}>
              <View style={styles.suggestionItem}>
                <Text style={styles.suggestionText}>{item.display_name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 9999,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    marginTop: 5,
    backgroundColor: "white",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    borderRadius: 20,
  },
  listContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#d4d4d4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default GoogleTextInput;

// if you have google api then use this code

// import { icons } from "@/constants";
// import { GoogleInputProps } from "@/types/type";
// import React from "react";
// import { Image, View } from "react-native";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

// const GoogleTextInput = ({
//   icon,
//   initialLocation,
//   textInputBackgroundColor,
//   containerStyle,
//   handlePress,
// }: GoogleInputProps) => {
//   return (
//     <View
//       className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`}
//     >
//       <GooglePlacesAutocomplete
//         fetchDetails={true}
//         placeholder="Where do you want to go?"
//         debounce={200}
//         styles={{
//           textInputContainer: {
//             alignItems: "center",
//             justifyContent: "center",
//             borderRadius: 20,
//             marginHorizontal: 20,
//             position: "relative",
//             shadowColor: "#d4d4d4",
//           },
//           textInput: {
//             backgroundColor: textInputBackgroundColor || "white",
//             fontSize: 16,
//             marginTop: 5,
//             width: "100%",
//             borderRadius: 200,
//           },
//           listView: {
//             backgroundColor: textInputBackgroundColor || "white",
//             position: "relative",
//             top: 0,
//             width: "100%",
//             borderRadius: 10,
//             shadowColor: "#d4d4d4",
//             zIndex: 99,
//           },
//         }}
//         onPress={(data, details = null) => {
//           handlePress({
//             latitude: details?.geometry.location.lat!,
//             longitude: details?.geometry.location.lng!,
//             address: data.description,
//           });
//         }}
//         query={{
//           key: googlePlacesApiKey,
//           language: "en",
//         }}
//         renderLeftButton={() => (
//           <View className="justify-center items-center w-6 h-6">
//             <Image
//               source={icon ? icon : icons.search}
//               className="w-6 h-6"
//               resizeMode="contain"
//             />
//           </View>
//         )}
//         textInputProps={{
//           placeholderTextColor: "gray",
//           placeholder: initialLocation ?? "Where do you want to go?",
//         }}
//       />
//     </View>
//   );
// };

// export default GoogleTextInput;
