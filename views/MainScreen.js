import React, { useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { Text } from 'react-native';
import styles from './MainScreenstyle'
import { ScrollView } from 'react-native';

import { PanResponder } from 'react-native';
//import { ScrollView } from 'react-native';
const MainScreen = () => {

    const [value, setValue] = useState('0');
    const [cursorPosition, setCursorPosition] = useState(value.length);
    const [history, setHistory] = useState([]);
    const scrollViewRef = useRef();
    const cursorOpacity = useRef(new Animated.Value(1)).current;

    // Blink effect for the cursor
    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(cursorOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
                Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        );
        blink.start();
        return () => blink.stop(); // Stop animation when the component unmounts
    }, [cursorOpacity]);
    const handelPress = (val) => {
        if (val === 'clearHistory') {
            setHistory([]);
        } 
        else if (val === 'forward') {
            if (cursorPosition < value.length) {
                setCursorPosition(cursorPosition + 1);
            }
        } else if (val === 'backward') {
            if (cursorPosition > 0) {
                setCursorPosition(cursorPosition - 1);
            }
        }
        else if (val === 'AC') {
            setValue('0');
            setCursorPosition(1);
        } else if (val === '=') {
            try {
                if ((value.match(/\(/g) || []).length === (value.match(/\)/g) || []).length) {
                    let result = eval(value.replace('()', '(0)'));
                    if (['+', '-', '*', '/', '.', '%'].includes(value.slice(-1))) {
                        result = eval(value.replace('()', '(0)').slice(0, -1));
                    }
                    setValue(`${result}`);
                    setHistory([...history, `${value} = ${result}`]);
                    setCursorPosition(`${result}`.length);
                }
            } catch (e) {
                setValue('Format Error');
                setCursorPosition(0);
            }
        } else if (val === 'back') {
            if (cursorPosition > 0) {
                const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
                setValue(newValue || '0');
                setCursorPosition(cursorPosition - 1);
            }
        } else if (val === '()') {
            const newValue =
                value === '0'
                    ? '('
                    : value.slice(0, cursorPosition) +
                      (value[cursorPosition - 1] === '(' ? ')' : '(') +
                      value.slice(cursorPosition);
            setValue(newValue);
            setCursorPosition(cursorPosition + 1);
        } else {
            const newValue =
                value === '0'
                    ? val
                    : value.slice(0, cursorPosition) + val + value.slice(cursorPosition);
            setValue(newValue);
            setCursorPosition(cursorPosition + 1);
        }
    };

    // Gesture handler for dragging
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const { dx } = gestureState; // Horizontal movement
                const movementThreshold = 20; // Adjust sensitivity

                if (dx > movementThreshold && cursorPosition < value.length) {
                    // Move cursor forward
                    setCursorPosition((prev) => Math.min(prev + 1, value.length));
                } else if (dx < -movementThreshold && cursorPosition > 0) {
                    // Move cursor backward
                    setCursorPosition((prev) => Math.max(prev - 1, 0));
                }
            },
        })
    ).current;

    // ref={ref=>{this.ScrollView=ref}} style={styles.main_screen_display}

  return (
    <View style={styles.main_screen}>
        <View
                style={styles.main_screen_display}
                {...panResponder.panHandlers} // Attach pan handlers
            >
                <Text style={styles.main_screen_display_text}>
                    {value.slice(0, cursorPosition)}
                    <Animated.Text style={[styles.cursor, { opacity: cursorOpacity }]}>
                        |
                    </Animated.Text>
                    {value.slice(cursorPosition)}
                </Text>
        </View>
      
            <View style={styles.history_title} >
            <Text style={styles.history_header_text}>For Dragging use this as Button</Text>
            
            <Pressable onPress={() => handelPress('backward')}>
                    <Text style={styles.control_button}>◀</Text>
            </Pressable>
             

               
            <Pressable onPress={() => handelPress('forward')}>
                        <Text style={styles.control_button}>▶</Text>
            </Pressable>
        </View>
        <View style={styles.history_title}>
            <Text style={styles.history_header_text}>History</Text>
            <Pressable onPress={() => handelPress('clearHistory')} style={styles.clear_button_container}>
                        <View style={styles.outer_clear} >
                                    <Text style={styles.button_clear}>
                                        Clear
                                    </Text>
                        </View>
            </Pressable>
        </View>
        
        {/* Conditional rendering for the history box */}
        {history.length > 0 && (
            <ScrollView style={styles.history_section}>
                {history.map((entry, index) => (
                    <Text key={index} style={styles.history_text}>
                        {entry}
                    </Text>
                ))}
            </ScrollView>
        )}
            

        <View style={styles.main_screen_keypad}>

            
            <View style={styles.main_screen_keypad_row}>
                <Pressable onPress={()=>handelPress('AC')}>
                    <View style={styles.btn1_outer} >
                        <Text style={styles.bg1_button}>
                            AC
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('()')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            ( )
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('%')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            %
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('/')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            /
                        </Text>
                    </View>
                </Pressable>
            </View>


            <View style={styles.main_screen_keypad_row}>
                <Pressable onPress={()=>handelPress('7')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            7
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('8')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            8
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('9')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            9
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('*')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            *
                        </Text>
                    </View>
                </Pressable>
            </View>


            <View style={styles.main_screen_keypad_row}>
                <Pressable onPress={()=>handelPress('4')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            4
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('5')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            5
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('6')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            6
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('-')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            -
                        </Text>
                    </View>
                </Pressable>
            </View>


            <View style={styles.main_screen_keypad_row}>
                <Pressable onPress={()=>handelPress('1')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            1
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('2')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            2
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('3')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            3
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('+')}>
                    <View style={styles.btn2_outer}>
                        <Text style={styles.bg2_button}>
                            +
                        </Text>
                    </View>
                </Pressable>
            </View>


            <View style={styles.main_screen_keypad_row}>
                <Pressable onPress={()=>handelPress('0')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            0
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('.')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            .
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('back')}>
                    <View style={styles.btn_outer}>
                        <Text style={styles.bg_button}>
                            DEL
                        </Text>
                    </View>
                </Pressable>

                <Pressable onPress={()=>handelPress('=')}>
                    <View style={styles.btn3_outer}>
                        <Text style={styles.bg3_button}>
                            =
                        </Text>
                    </View>
                </Pressable>
            </View>

        </View>

        <View style={styles.name}>
                <Text style={styles.nameInner}> Calc By Vaibhav</Text>
        </View>
    </View>
  )
}


export default MainScreen
