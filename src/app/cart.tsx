import { useState } from "react";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { useNavigation } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ProductCartProps, useCartStore } from "@/stores/cart-store";

import { formatCurrency } from "@/utils/functions/format-currency";

import { Product } from "@/components/product";
import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";

const PHONE_NUMBER = "5565993125689"

export default function Cart() {
    const [address, setAddress] = useState("")
    const cartStore = useCartStore()
    const navigation = useNavigation()

    const total = formatCurrency(cartStore.products.reduce((total, product) => total + product.price * product.quantity, 0))

    function handleProductRemove(product: ProductCartProps) {
        Alert.alert("Remover", `Deseja remover ${product.title} do carrinho?`, [
            {
                text: "Não",
            },
            {
                text: "Sim",
                onPress: () => cartStore.remove(product.id),
            }
        ])
    }

    function handleOrder() {
        if (address.trim().length === 0) {
            return Alert.alert("Pedido", "Informe os dados da entrega...")
        }

        const products = cartStore.products.map((product) => `\n ${product.quantity} ${product.title}`).join("")
        const message = `
        🚨 NOVO PEDIDO 🚨
        \n📍 Entregar --> ${address}

        ${products}

        \n💰 Total da compra: ${total}
        `
        Linking.openURL(
            `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
        )
        cartStore.clear()
        navigation.goBack()
    }

    return (
        <View className="flex-1 pt-8">
            <Header title="Seu carrinho" />
            <KeyboardAwareScrollView>
                <ScrollView>
                    <View className="p-5 flex-1 ">
                        {cartStore.products.length > 0 ? (
                            <View className="border-b border-slate-700">
                                {
                                    cartStore.products.map((product) => (
                                        <Product key={product.id} data={product} onPress={() => handleProductRemove(product)} />
                                    ))
                                }
                            </View>
                        ) : (
                            <Text className="font-body text-black text-center my-8">
                                Seu carrinho está vazio.
                            </Text>
                        )}
                        <View className="flex-row gap-2 items-center mt-5 mb-4" >
                            <Text className="text-white text-xl font-subtitle">Total</Text>
                            <Text className="text-lime-400 text-2xl font-heading">{total}</Text>
                        </View>
                        <Input
                            placeholder="Informe seu endereço de entrega..."
                            onChangeText={setAddress}
                            blurOnSubmit
                            onSubmitEditing={handleOrder}
                            returnKeyType="next"
                        />
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
            <View className="p-5 gap-5 text-black">
                <Button onPress={handleOrder} className="text-black">
                    <Button.Text>
                        Enviar Pedido
                    </Button.Text>
                    <Button.Icon>
                        <Feather name="arrow-right-circle" size={30} />
                    </Button.Icon>
                </Button>

                <LinkButton title="Voltar ao Cardápio" href="/" />
            </View>
        </View>
    )
}