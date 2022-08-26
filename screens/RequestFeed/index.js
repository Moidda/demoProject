import { 
    View, 
    Image, 
    Text, 
    ScrollView, 
    FlatList,
    TouchableOpacity,
    Modal,
    Pressable
} from "react-native";

import React from "react";
import { firebase } from '@react-native-firebase/database';

import Icon from 'react-native-vector-icons/FontAwesome';
import AntIcon from 'react-native-vector-icons/AntDesign';

import styles from "./styles";
import * as Constants from "../../constants";
import RequestCard from "../../components/RequestCard";
import Contact from "../../components/Contact";
import { BaseRouter } from "@react-navigation/native";


const getRequests = async () => {
    var snapshot = await firebase
                    .app()
                    .database(Constants.REALTIME_DATABASE_URL)
                    .ref('/Request')
                    .once('value');

    const requests = snapshot.val();
    return requests;
};


const RequestFeed = (props) => {
    
    var tempData = [];
    const [ requests,   setRequests    ] = React.useState('');
    const [ data,       setData        ] = React.useState('');
    const [ filterData, setFilterData  ] = React.useState('');
    const [ isFilterOn, setIsFilterOn  ] = React.useState(false);
    const [ urgency,    setUrgency     ] = React.useState('');
    const [ modalVisible, setModalVisible ] = React.useState(false);
    const [ modalContact, setModalContact ] = React.useState('');


    React.useEffect(() => {
        getRequests().then(requests => {
            setRequests(requests);
            for(var reqId in requests) {
                var req = requests[reqId];
                    tempData.push({
                        key                 : reqId,
                        name                : req['name'],
                        hospital            : req['hospital'],
                        location            : req['location'],
                        urgency             : req['urgency'],
                        note                : req['note'],
                        bloodGroup          : req['bloodGroup'],
                        bloodAmount         : req['bloodAmount'],
                        requesterContact    : req['requesterContact'],
                    });
            }
            setData(tempData);
            setFilterData(tempData);
        });
    }, []);

    const onPressUrgency = (filterUrgency) => {
        if(urgency === filterUrgency) {
            setUrgency('none');
            setFilterData(data);
        }
        else {
            setUrgency(filterUrgency);
            var tempData = [];
            data.forEach(element => {
                if(element.urgency === filterUrgency) {
                    tempData.push(element);
                }
            });
            setFilterData(tempData);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=>{ setIsFilterOn(!isFilterOn) }}>
                <View style={styles.filterContainer}>
                    <AntIcon
                        name="bars"
                        size={20}
                        color={Constants.DEFAULT_RED}
                    />
                    <Text style={styles.filtertextStyle}>
                        Filter By
                    </Text>
                    {
                        isFilterOn ?
                        <AntIcon 
                            name="caretup" 
                            size={20} 
                            color={Constants.DEFAULT_RED}
                            style={{marginLeft: '4%', marginRight: '60%'}}
                        />
                        :
                        <AntIcon 
                            name="caretdown" 
                            size={20} 
                            color={Constants.DEFAULT_RED}
                            style={{marginLeft: '4%', marginRight: '60%'}}
                        />
                    }
                </View>
            </TouchableOpacity>

            {
                isFilterOn ?
                <View style={styles.radioButtonContainer}>
                    <View style={styles.radioButtonHeader}>
                        <TouchableOpacity onPress={ (urgency) => onPressUrgency(Constants.urgency.immediate) }>
                            <View style={styles.radioButton}>
                            {
                                urgency === "immediate"?
                                <View style={styles.radioButtonSelected} />
                                : null
                            }
                            </View>
                        </TouchableOpacity>    

                        <Text style={styles.urgencyTextStyle} >
                            Immediate
                        </Text>
                    </View>

                    <View style={styles.radioButtonHeader}>
                        <TouchableOpacity onPress={ (urgency) => onPressUrgency(Constants.urgency.standBy) }>
                            <View style={styles.radioButton}>
                            {
                                urgency === "standBy"?
                                <View style={styles.radioButtonSelected}/> 
                                : null
                            }
                            </View>
                        </TouchableOpacity>    

                        <Text style={styles.urgencyTextStyle} >
                            StandBy
                        </Text>
                    </View>

                    <View style={styles.radioButtonHeader}>
                        <TouchableOpacity onPress={ (urgency) => onPressUrgency(Constants.urgency.longTerm) }>
                            <View style={styles.radioButton}>
                            {
                                urgency === "longTerm"?
                                <View style={styles.radioButtonSelected} />
                                : null
                            }
                            </View>
                        </TouchableOpacity>    
                        
                        <Text style={styles.urgencyTextStyle}>
                            Long Term
                        </Text>
                    </View>    
                </View>
                :
                null
            }

            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent={true}
            >   
                <View style={{justifyContent:'center', alignItems:'center'}}>
                    <Contact 
                    contactno={modalContact} 
                    onPressCancel={ () => { setModalVisible(false) }}
                    />
                </View>
            </Modal>
           
            
            <FlatList 
                data={filterData}
                renderItem={ ({item}) => (
                    <RequestCard 
                        name             = { item.name             }
                        hospital         = { item.hospital         }
                        location         = { item.location.name    }
                        urgency          = { item.urgency          }
                        note             = { item.note             }
                        bloodGroup       = { item.bloodGroup       }
                        bloodAmount      = { item.bloodAmount      }
                        requesterContact = { item.requesterContact }
                        onPress          = { () => {
                            setModalVisible(true); 
                            setModalContact(item.requesterContact);
                        }}
                    />
                )}
            />
        </View>
    );
};

export default RequestFeed;