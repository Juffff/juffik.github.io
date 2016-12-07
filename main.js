const DEMO_POSTS = [
    {
        id: "1",
        name: "Классы в JS",
        postBody: `### Синтаксис для классов выглядит так:
        
            class Название [extends Родитель]  
            {
                constructor
                методы
            }
            `,
        tags: ["классы", "JS", "code", "prog"]
    },
    {
        id: "2",
        name: "React blue logo",
        postBody: "![React](https://www.shareicon.net/download/2016/08/01/640324_logo.ico)",
        tags: ["react", "logo", "prog"]
    }
];

const remarcable = new Remarkable({
    html: true,       // Enable HTML tags in source
    xhtmlOut: true,       // Use '/' to close single tags (<br />)
    breaks: true,       // Convert '\n' in paragraphs into <br>
    linkify: true,       // Autoconvert URL-like text to links
    typographer: true,
    quotes: '“”‘’'
});

function createPostText(text) {
    return {__html: remarcable.render(`${text.state.text}`)};
}

const PostEditor = React.createClass({
    getInitialState() {
        return ({
            name: this.props.postProps.postName,
            text: this.props.postProps.postBody
        })
    },
    handlerOnNameChange(e) {
        this.setState({name: e.target.value});
    },
    handlerOnTextChange(e) {
        this.setState({text: e.target.value});
    },

    render() {

        return (
            <div className="pannel panel-warning">
                <div className="editorHeader panel-heading">EDIT POST</div>
                <div className="editorControls">
                    <input className="editorNameInput form-control" type="text"
                           defaultValue={this.state.name} onChange={this.handlerOnNameChange}/>
                    <input className="editorTextInput form-control" type="text"
                           defaultValue={this.state.text} onChange={this.handlerOnTextChange}/>
                    <input className="editorTextInput form-control" type="text"/>
                    <input className="editorSendButton btn btn-primary btn-lg" type="button" value={"EDIT"}
                           onClick={() => this.props.onEdit(this.state.name, this.state.text)}/>
                </div>
            </div>
        );
    }
});

const Post = React.createClass({
    getInitialState(){
        return ({
            collapsed: false,
            inEdit: false,
            name: this.props.postName,
            text: this.props.postBody
        })
    },

    handlerDeleteClick(){
        this.props.onDelete(this.props.id);
    },

    handlerCollapseClick(){
        this.setState({
            collapsed: !this.state.collapsed
        });
    },

    handlerOnEditClick(){
        this.setState({
            inEdit: !this.state.inEdit
        });
    },

    handlerOnEdit(name, text){
        this.setState({
            name: name,
            text: text,
            inEdit: false
        })
    },

    handlerTagClick(tag){
        this.props.onTagClick(tag);
    },

    componentDidMount(){
        this.props.onMount(this.props.tags);
    },

    render(){
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">
                    <div className="panel-title">
                        <div className="postHeader">
                            <div className="postName">{this.state.name}</div>
                            <div className="postControls">
                                <div className="postControlButton fa fa-pencil-square-o"
                                     onClick={this.handlerOnEditClick}/>
                                <div className="postControlButton fa fa-minus-square-o"
                                     onClick={this.handlerCollapseClick}/>
                                <div className="postControlButton fa fa-times-circle"
                                     onClick={this.handlerDeleteClick}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`postBody panel-body ${this.state.collapsed ? "collapsed" : ""}`}
                     dangerouslySetInnerHTML={createPostText(this)}></div>
                <div className="tagContainer">
                    {this.props.tags.map(tag => <div className="tag" key={this.props.id + tag}
                                                     onClick={() => this.handlerTagClick(tag)}>{tag}</div>)}
                </div>
                <div className={this.state.inEdit ? "postFooter" : "postFooter collapsed"}>
                    <PostEditor postProps={this.props} onEdit={this.handlerOnEdit}/>
                </div>
            </div>
        )
    }
});

const PostCreator = React.createClass({
    getInitialState(){
        return {
            name: "",
            text: "",
            tagString: ""
        }
    },

    handlerOnClick(name, text, tagString){
        this.props.onAddNewPost(name, text, tagString.split(/[,]|\s/));
    },

    handlerNameOnChange(e){
        this.setState({
            name: e.target.value
        })
    },

    handlerTextOnChange(e){
        this.setState({
            text: e.target.value
        })
    },

    handlerTagsOnChange(e){
        this.setState({
            tagString: e.target.value
        })
    },

    render() {
        return (
            <div className="panel panel-primary">
                <div className="panel-heading">CREATOR</div>
                <div className="editorControls">
                    <input className=" form-control" type="text" placeholder="Input post name"
                           onChange={this.handlerNameOnChange}/>
                    <input className=" form-control" type="text" placeholder="Input post text"
                           onChange={this.handlerTextOnChange}/>
                    <input className=" form-control" type="text" placeholder="Input tags (splitter is comma or space )"
                           onChange={this.handlerTagsOnChange}/>
                    <button className="editorSendButton btn btn-primary btn-lg" type="button"
                            onClick={() => this.handlerOnClick(this.state.name, this.state.text, this.state.tagString)}>
                        CREATE
                    </button>
                    <br />
                    <div className="preview">PREVIEW</div>
                    <div>
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <div className="panel-title">
                                    <div className="postHeader">
                                        <div className="postName">{this.state.name}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="postBody panel-body" dangerouslySetInnerHTML={createPostText(this)}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

const App = React.createClass({
    getInitialState(){
        return {
            posts: this.props.posts,
            postsToDelete: [],
            search: "",
            editMode: false,
            tags: {},
            filterTag: "",
            saveFilterTags: {}
        }
    },

    addTagsToTagArray(tags){
        if (Object.keys(this.state.saveFilterTags).length === 0) {
            typeof this.tagArr != 'undefined'
                ? this.tagArr = this.tagArr.concat(tags)
                : this.tagArr = tags;
            this.processTags();
        }
    },

    handlerAddNewPost(name, text, tags){
        this.setState({
            saveFilterTags: {}
        });
        let postArray = this.state.posts;
        postArray = postArray.concat({
            id: `${this.state.posts.length + 1}`,
            name: name,
            postBody: text,
            tags: tags
        });

        this.setState({
            posts: postArray
        });
    },

    handlerDeletePost(id){
        this.setState({
            postsToDelete: this.state.postsToDelete.concat(id)
        });
    },

    handlerOnSearchChange(e){
        this.setState({
            search: e.target.value.toLocaleLowerCase()
        })
    },

    handlerTagClick(tag){
        console.log(Object.keys(this.state.tags));
        const savedTags = {};
        (Object.keys(this.state.tags)).forEach(tag => savedTags[tag] = this.state.tags[tag]);
        this.setState({
            filterTag: tag,
            saveFilterTags: savedTags
        });
        console.log(savedTags);
    },

    handlerClickClearTagFilter(){
        this.setState({
            filterTag: "",
        });
    },

    postsToRender(posts){
        return posts.map(post =>
            <Post
                key={post.id}
                id={post.id}
                postName={post.name}
                postBody={post.postBody}
                tags={post.tags}
                onDelete={this.handlerDeletePost}
                onTagClick={this.handlerTagClick}
                onMount={this.addTagsToTagArray}
            />)
            .filter(post => this.state.postsToDelete.indexOf(post.props.id) === -1)
            .filter(post => post.props.postName.toLocaleLowerCase().indexOf(this.state.search.toLocaleLowerCase()) !== -1)
            .filter(post => this.state.filterTag !== "" ? (post.props.tags.map(el => el.toLowerCase()).indexOf(this.state.filterTag.toLowerCase()) !== -1 ? 1 : 0) : 1)
    },

    render(){
        return (
            <div className="appContainer">
                <div className="appBody">
                    <div className="lCol">
                        <div className="postsContainer">
                            {this.postsToRender(this.state.posts)}
                        </div>
                    </div>
                    <div className="rCol">
                        <div className="postEditor">
                            <input className="form-control" placeholder="Search post by name..."
                                   onChange={this.handlerOnSearchChange}/>
                            <br/>
                            <br/>
                            <PostCreator onAddNewPost={this.handlerAddNewPost}/>
                            <div className="panel panel-primary">
                                <div className="panel-heading">
                                    <div className="tagsTitle panel-title">
                                        TAGS
                                        <div className="clearTagFilter" onClick={this.handlerClickClearTagFilter}>
                                            Clear filter
                                        </div>
                                    </div>
                                </div>
                                <div className="appTagsBody panel-body">
                                    {
                                        Object.keys(this.state.tags).map(tag =>
                                            <div className="tag" key={tag} onClick={() => this.handlerTagClick(tag)}>
                                                {`${tag.toLocaleLowerCase()} : ${this.state.tags[tag]}`}
                                            </div>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    processTags(){
        let tagCount = {};
        this.tagArr.map(tag => {
            tagCount[tag] ? tagCount[tag]++ : tagCount[tag] = 1
        });
        let tagCountSorted = {};
        Object.keys(tagCount).sort((tagA, tagB) => tagCount[tagB] - tagCount[tagA])
            .map(tag => tagCountSorted[tag] = tagCount[tag]);
        this.setState({
            tags: tagCountSorted
        });
    },

    componentDidMount(){

        this.processTags();
    },


});

ReactDOM.render(<App posts={DEMO_POSTS}/>, document.getElementById("root"));
