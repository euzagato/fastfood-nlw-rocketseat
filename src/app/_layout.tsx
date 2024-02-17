import { SafeAreaView } from "react-native"
import { Slot } from "expo-router";
import {
    useFonts,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
} from "@expo-google-fonts/roboto"
import { Loading } from "@/components/loading";

export default function Layout(){
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    })

    if(!fontsLoaded){
        return <Loading />
    }
    return (
    <SafeAreaView className="flex-1 bg-slate-900">
        <Slot />
    </SafeAreaView>
    )
}