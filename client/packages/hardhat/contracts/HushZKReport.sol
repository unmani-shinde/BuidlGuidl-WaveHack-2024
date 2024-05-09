//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract HushZKReport {

    struct Comment{
        uint256 commentID;
        string timestamp;
        string content;
    }

    string metadata;
    uint256 public upvotes;
    uint256 public downvotes;
    uint256 public numComments;
    mapping(uint256 => Comment) public reportComments;

    event CommentAdded(address comment_creator);
    event CommentUpvoted(uint256 commentID);
    event CommentDownvoted(uint256 commentID);


    constructor(string memory _metadata) {
        metadata = _metadata;
        upvotes = 0;
        downvotes = 0;
        numComments = 0;
    }

    function addComment(string memory _timestamp, string memory _content) external {
        numComments++;
        reportComments[numComments] = Comment(numComments, _timestamp, _content);
        emit CommentAdded(msg.sender);
    }

    function upvoteComment(uint256 _commentID) external {
        require(_commentID <= numComments, "Invalid comment ID");
        upvotes++;
        emit CommentUpvoted(_commentID);
    }

    function downvoteComment(uint256 _commentID) external {
        require(_commentID <= numComments, "Invalid comment ID");
        downvotes++;
        emit CommentDownvoted(_commentID);
    }



}