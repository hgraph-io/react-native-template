import { Button, Text, View } from "react-native";
import {useState, useRef} from 'react'
import Client from '@hgraph.io/sdk'

const LatestTransactionSubscription = `
subscription LatestTransaction {
  transaction(limit: 1, order_by: {consensus_timestamp: desc}) {
    consensus_timestamp
  }
}`

const client = new Client()

export default function Index() {

  const [state, setState] = useState()
  const [subscribed, setSubscribed] = useState(false)
  const unsubscribe = useRef(() => {})

  const toggle = () => {
    if (subscribed) {
      unsubscribe.current()
      setSubscribed(false)
    } else {
      unsubscribe.current = client.subscribe(LatestTransactionSubscription, {
        // handle the data
        next: (data: any) => {
          console.log(data)
          setState(data)
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => {
          unsubscribe.current = () => {}
          console.log('Optionally do some cleanup')
        },
      }).unsubscribe;
      setSubscribed(true)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        gap: 20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button onPress={toggle} title={subscribed ? 'Stop' : 'Start'} />
      <Text>{JSON.stringify(state)}</Text>
    </View>
  );
}
