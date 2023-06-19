import React from "react";

import { useParams } from "react-router-dom";

import { Container, Grid, Image, Header, Segment, Icon } from "semantic-ui-react";

import Topics from "../components/Topics";
import firebase from "../utils/firebase";

function Post() {
    // return "Post"

    // use postId to get the post
    const { postId } = useParams();
    const [post, setPost] = React.useState({
        author: {},
    });

    React.useEffect(() => {
        // use .doc() to get the post from the .collection()
        firebase
            .firestore()
            .collection("posts")
            .doc(postId)

            // monitoring and auto rendering
            // below code enable bookmark change immediately right after click
            .onSnapshot((docSnapshot) => {
                const data = docSnapshot.data();
                setPost(data);
            })

            // below code need to refresh the page every time after changing something
            // .get()
            // .then((docSnapshot) => {
            //     const data = docSnapshot.data();
            //     setPost(data);
            // });
        }, []);

    // function to save post and connect with firebase, firestore
    function toggleCollected() {

        const uid = firebase.auth().currentUser.uid;

        if (isCollected) {
            firebase
                .firestore()
                .collection("posts")
                .doc(postId)
                .update({

                    // this will keep all previous users and remove the current users
                    collectedBy: firebase.firestore.FieldValue.arrayRemove(uid),
                });
        } else {
            firebase
                .firestore()
                .collection("posts")
                .doc(postId)
                .update({

                    // this wil clear all other users
                    // collectedBy: [uid],

                    // this will keep all previous users and append the current users
                    collectedBy: firebase.firestore.FieldValue.arrayUnion(uid),
                });
        }
    }

    // .collectedBy? to check if there's .collectedBy on firebase, firestore
    // .includes() to check if there's current user
    const isCollected = post.collectedBy?.includes(firebase.auth().currentUser.uid)

    return (
        <Container>
            <Grid>
                {/* default grid size of row is 16 */}
                <Grid.Row>
                    {/* <Grid.Column width={3}>Category</Grid.Column> */}
                    <Grid.Column width={3}>
                        <Topics/>
                    </Grid.Column>

                    <Grid.Column width={10}>
                        {/* display user icon if no photo of user */}
                        {post.author.photoURL ? 
                            (<Image src={post.author.photoURL} />
                            ) : (
                            <Icon name="user circle" />)
                            } {""}
                            {/* display User if no username */}
                            {post.author.displayName || "User"}
                        <Header>
                            {post.title}
                            <Header.Subheader>
                                {post.topic}
                                {/* use .toDate() to turn firebase object into JavaScript date format */}
                                ．
                                {/* .createdAt?: optional chaining */}
                                {post.createdAt?.toDate().toLocaleDateString()}
                            </Header.Subheader>
                        </Header>
                        <Image src={post.imageURL} />
                        {/* basic hide border and vertical remove border */}
                        <Segment basic vertical>{post.content}</Segment>
                        <Segment basic vertical>
                            Comment 0．Like 0．
                            <Icon name="thumbs up outline" color="grey"/>
                            <Icon 
                                // if saved before, the bookmark icon is blue. Otherwise, only outline
                                // name="bookmark outline"
                                // need to separate ...bookmark and ${... Otherwise, the bookmark won't show
                                name={`bookmark ${isCollected ? "" : "outline"}`}
                                color={isCollected ? "blue" : "grey"}
                                link 
                                onClick={toggleCollected}
                            />
                        </Segment>

                    </Grid.Column>

                    <Grid.Column width={3}>
                        
                    </Grid.Column>

                </Grid.Row>    
            </Grid>
        </Container>
    );
}

export default Post;
