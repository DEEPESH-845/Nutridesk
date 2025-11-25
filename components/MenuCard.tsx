import { Text, Platform, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MenuItem } from "@/type";
import { useCartStore } from "@/store/cart.store";

const MenuCard = ({
	item: { $id, image_url, name, price },
}: {
	item: MenuItem;
}) => {
	const { addItem } = useCartStore();

	return (
		<TouchableOpacity
			className="menu-card"
			style={
				Platform.OS === "android"
					? { elevation: 10, shadowColor: "#878787" }
					: {}
			}
		>
			<Image
				source={{ uri: image_url }}
				className="size-32 absolute -top-10 "
				resizeMode="contain"
			/>
			<Text
				className="text-center base-bold text-dark-100 mb-2"
				numberOfLines={1}
			>
				{name}
			</Text>
			<Text className="body-regular text-gray-200 mb-4 ">From ${price}</Text>
			<TouchableOpacity
				onPress={() =>
					addItem({
						id: $id,
						name,
						price,
						image_url: image_url,
						customisation: [],
					})
				}
			>
				<Text className="paragraph-bold text-primary">Add to Cart +</Text>
			</TouchableOpacity>
		</TouchableOpacity>
	);
};

export default MenuCard;
