import React from 'react';
import { WebView, BackHandler } from 'react-native';
//import { WebView } from 'react-native-yunpeng-webview';
import styles from './styles.js';

export default class PageView extends React.Component {
    constructor(props) {
        super(props);
        this.homeURL = this.props.navigation.getParam('link', '');
        this.canGo = false;
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Page view'),
            headerTitleStyle: {
                fontSize: 9
            }
        };
    };

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (!this.canGo) {
                this.props.navigation.navigate('Home');
            } else {
                this.webview.goBack();
            }
            return true;
        });
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }


    render() {
        return (
            <WebView
                ref={r => this.webview = r}
                source={{ uri: this.props.navigation.getParam('link', '') }}
                startInLoadingState
                scalesPageToFit
                javaScriptEnabled
                style={{ margin: 3, flex: 1 }}
                onNavigationStateChange={({ canGoBack }) => {
                    this.canGo = canGoBack;
                }}
            />
        );
    }
} 