import { useEffect, useState } from "react";
import { Heading, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const { navigate, addListener } = useNavigation();

  const toast = useToast();

  useEffect(() => {
    const subscribe = addListener("focus", () => setIsLoading(false));
    return subscribe;
  }, []);

  async function handleJoinPool() {
    try {
      if (!code.trim()) {
        return toast.show({
          title: "Código invlaido",
          placement: "top",
          bgColor: "red.500",
        });
      }
      setIsLoading(true);
      await api.post("/pools/join", { code });
      toast.show({
        title: "Você entrou no bolão com sucesso",
        placement: "top",
        bgColor: "green.500",
      });
      setCode("");
      navigate("pools");
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === "Pool not found") {
        return toast.show({
          title: "Bolão não encontrado",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (error.response?.data?.message === "you already joined this pool") {
        return toast.show({
          title: "Você já esta nesse bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }
      return toast.show({
        title: "Ocorreu um erro",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR MEU BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
