import { Text, View, Image, ViewStyle } from "react-native";
import { styles, imageStyle } from "./GameStyles";
import { useState, useEffect, SetStateAction, Dispatch } from "react";

import { fetchQuestionsForGame } from "../../util/ApiManager";
import { Question } from "../../util/ApiManager";

import BigButton from "../../components/BigButton/BigButton";

import { _pmd_001, _pmd_002, _pmd_003 } from "../../util/PremadeQuestions";

interface GameProps {
  gameId: string;
  setGameId: Dispatch<SetStateAction<string>>;
  view: string;
  setView: Dispatch<SetStateAction<string>>;
}

export default function Game({ setGameId, setView, gameId, view }: GameProps) {
  const [nextButtonText, setNextButtonText] = useState("Start Spill");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState("");

  const [dotOne, setDotOne] = useState(false);
  const [dotTwo, setDotTwo] = useState(false);
  const [dotThree, setDotThree] = useState(false);
  const [textbox, setTextbox] = useState(false);

  const mascot = require("../../assets/images/raptorrune.png");

  useEffect(() => {
    if (gameId === "_pmd_001") {
      setQuestions(_pmd_001);
    }

    if (gameId === "_pmd_002") {
      setQuestions(_pmd_002);
      return;
    }

    if (gameId === "_pmd_003") {
      setQuestions(_pmd_003);
      return;
    }

    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const fetchedQuestions: Question[] = await fetchQuestionsForGame(gameId);
    setQuestions(fetchedQuestions);
  };

  const toggleDotThree = (activated: boolean): ViewStyle => ({
    ...styles.questionAnimationDotOne,
    display: activated ? "flex" : "none",
  });

  const toggleDotTwo = (activated: boolean): ViewStyle => ({
    ...styles.questionAnimationDotTwo,
    display: activated ? "flex" : "none",
  });

  const toggleDotOne = (activated: boolean): ViewStyle => ({
    ...styles.questionAnimationDotThree,
    display: activated ? "flex" : "none",
  });

  const toggleTextbox = (activated: boolean): ViewStyle => ({
    ...styles.questionAnimationTextbox,
    display: activated ? "flex" : "none",
  });

  const handleNextQuestion = () => {
    setNextButtonText("Neste");

    setTextbox(false);
    setDotThree(false);
    setDotTwo(false);

    setDotOne(true);
    setTimeout(() => {
      setDotTwo(true);
    }, 300);
    setTimeout(() => {
      setDotThree(true);
    }, 600);
    setTimeout(() => {
      setTextbox(true);
    }, 900);

    const randomIndex = Math.random() * questions.length;
    const randomQuestion = questions.at(randomIndex);

    setQuestion(
      randomQuestion === undefined
        ? "Spillet er ferdig!"
        : randomQuestion.questionStr
    );

    setQuestions(questions.filter((q) => q !== randomQuestion));
  };

  const handleLeave = () => {
    setGameId("");
    setView("HOME");
  };

  return (
    <>
      <View style={styles.gameContainer}>
        <View style={styles.buttonContainer}>
          <BigButton text={nextButtonText} handlePress={handleNextQuestion} />
          <BigButton text="Leave" handlePress={handleLeave} />
        </View>
      </View>

      {/* Game Animation */}
      <View style={styles.questionAnimationContainer}>
        <View style={toggleTextbox(textbox)}>
          <Text style={styles.text}>{question}</Text>
        </View>
        <View style={toggleDotOne(dotOne)}></View>
        <View style={toggleDotTwo(dotTwo)}></View>
        <View style={toggleDotThree(dotThree)}></View>
      </View>

      {/* Absolute Mascot*/}
      <View style={styles.mascotContainer}>
        <Image source={mascot} style={imageStyle.mascot} />
      </View>
    </>
  );
}
