import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type FileData = {
    filename : Text;
    content : Text;
  };

  public type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  public type SessionData = {
    id : Text;
    name : Text;
    projectType : Text;
    messages : List.List<Message>;
    files : List.List<FileData>;
    createdAt : Int;
    updatedAt : Int;
    owner : Principal.Principal;
  };

  public type Actor = {
    sessionMap : Map.Map<Text, SessionData>;
  };

  public func run(old : Actor) : Actor {
    old;
  };
};
