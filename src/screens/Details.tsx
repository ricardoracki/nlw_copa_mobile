import { useState, useEffect } from "react";
import { Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsloading] = useState(true);
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [pool, setPool] = useState<PoolCardProps>({} as PoolCardProps);

  const toast = useToast();

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchDetails() {
    try {
      setIsloading(true);
      const response = await api.get(`/pools/${id}`);
      setPool(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: `Participe do bolão com o código ${pool.code}`,
    });
  }

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (isLoading) return <Loading />;
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={pool.title}
        showBackButton={true}
        showShareButton={true}
        onShare={handleCodeShare}
      />
      {pool._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pool} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected == "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="inging do grupo"
              isSelected={optionSelected == "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>
          <Guesses poolId={pool.id} code={pool.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pool.code} />
      )}
    </VStack>
  );
}
