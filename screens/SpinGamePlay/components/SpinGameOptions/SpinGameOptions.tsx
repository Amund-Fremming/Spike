import React, { Dispatch, SetStateAction, useState } from "react";
import { View, Alert } from "react-native";
import { styles } from "./SpinGameOptionsStyles";
import { validateInput } from "../../../../util/InputValidator";

import BigButton from "../../../../components/BigButton/BigButton";
import MediumButton from "../../../../components/MediumButton/MediumButton";
import BigInput from "../../../../components/BigInput/BigInput";

import {
  createGame,
  IGame,
  gameExists,
  haveGameStarted,
} from "../../../../util/GameApiManager";
import StegoMascot from "../../../../components/StegoMascot/StegoMascot";

interface HostProps {
  setView: Dispatch<SetStateAction<string>>;
  view: string;
  gameId: string;
  setGameId: Dispatch<SetStateAction<string>>;
  deviceId: string;
}

export default function SpinGameOptions({
  view,
  setView,
  gameId,
  setGameId,
  deviceId,
}: HostProps) {
  const [clickedAndIsLoading, setClickedAndIsLoading] = useState(false);
  const [hostText, setHostText] = useState("Host");
  const [joinText, setJoinText] = useState("Join");

  const handleClick = async () => {
    if (clickedAndIsLoading) return; // Stops the api from being spammed
    setClickedAndIsLoading(true);

    view === "SPIN_HOST"
      ? setHostText("Hosting ...")
      : setJoinText("Joining ...");

    if (!validateInput(gameId)) {
      Alert.alert(
        "Invalid Input",
        "Some characters are not allowed, try again"
      );
      setClickedAndIsLoading(false);
      setGameId("");
      view === "SPIN_HOST" ? setHostText("Host") : setJoinText("Join");
      return;
    }

    if (gameId.length > 10) {
      Alert.alert("Invalid Input", "Game ID is too long (<10), try again");
      setClickedAndIsLoading(false);
      setGameId("");
      view === "SPIN_HOST" ? setHostText("Host") : setJoinText("Join");
      return;
    }

    if (view === "SPIN_HOST") {
      const game: IGame = {
        creatorId: deviceId,
        gameId: gameId,
        gameStarted: false,
        publicGame: false,
        iconImage: "NICE",
        numberOfQuestions: 0,
        upvotes: 0,
        usersVote: 2,
      };

      let response;
      try {
        response = await createGame(game);
      } catch (error) {
        Alert.alert(
          "Bad connection",
          "Please check your wifi connection and try again."
        );
        view === "SPIN_HOST" ? setHostText("Host") : setJoinText("Join");
        setClickedAndIsLoading(false);
        return;
      }

      if (response === "GAME_EXISTS") {
        Alert.alert(
          "Invalid Game Name",
          `Game with Name ${gameId}, already exists!`
        );
        setClickedAndIsLoading(false);
        setGameId("");
        setHostText("Host");
        return;
      }
    }

    let gameStarted;
    try {
      gameStarted = await haveGameStarted(gameId);
    } catch (error) {
      Alert.alert(
        "Bad connection",
        "Please check your wifi connection and try again."
      );
      view === "SPIN_HOST" ? setHostText("Host") : setJoinText("Join");
      setClickedAndIsLoading(false);
      return;
    }

    if (view === "SPIN_JOIN" && gameStarted) {
      Alert.alert(
        "Invalid Game ID",
        `Game with ID ${gameId}, already started!`
      );
      setClickedAndIsLoading(false);
      setGameId("");
      setJoinText("Join");
      return;
    }

    const gameExist = await gameExists(gameId);
    if (view === "SPIN_JOIN" && !gameExist) {
      Alert.alert("Invalid Game ID", `Game with ID ${gameId}, does not exist!`);
      setClickedAndIsLoading(false);
      setGameId("");
      setHostText("");
      return;
    }

    setClickedAndIsLoading(false);
    setView(view === "SPIN_HOST" ? "SPIN_HOST_LOBBY" : "SPIN_LOBBY");
  };

  return (
    <View style={styles.buttonContainer}>
      <StegoMascot />
      <View style={styles.buttonWrapper}>
        <BigInput
          value={gameId}
          placeholder="Game Name"
          handleChange={(text) => setGameId(text.toUpperCase())}
        />
        <BigButton
          text={view === "SPIN_HOST" ? hostText : joinText}
          handlePress={handleClick}
        />
        <MediumButton text="Back" handlePress={() => setView("SPIN_HOME")} />
      </View>
    </View>
  );
}
