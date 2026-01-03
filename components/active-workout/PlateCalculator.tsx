import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useState } from 'react';

interface PlateCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
  targetWeight: number;
}

export function PlateCalculator({ isVisible, onClose, targetWeight }: PlateCalculatorProps) {
  const barWeight = 20;
  const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25];
  
  const calculatePlates = (weight: number) => {
    let remaining = (weight - barWeight) / 2;
    const plates: number[] = [];
    
    if (remaining < 0) return [];

    availablePlates.forEach(plate => {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    });
    
    return plates;
  };

  const plates = calculatePlates(targetWeight);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-card rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-white text-2xl font-bold">Plate Calculator</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View className="items-center mb-8">
            <Text className="text-subtext mb-2">Target Weight Per Side</Text>
            <Text className="text-white text-4xl font-bold">
              {(targetWeight - barWeight) / 2} kg
            </Text>
            <Text className="text-subtext mt-4">Total Weight: {targetWeight} kg (incl. 20kg bar)</Text>
          </View>

          <View className="flex-row flex-wrap justify-center mb-8">
            {plates.length > 0 ? plates.map((plate, i) => (
              <View 
                key={i} 
                className="bg-primary m-1 w-16 h-16 rounded-full items-center justify-center border-2 border-white/20"
              >
                <Text className="text-white font-bold">{plate}</Text>
              </View>
            )) : (
              <Text className="text-subtext">No plates needed for this weight.</Text>
            )}
          </View>

          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
