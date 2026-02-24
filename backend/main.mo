import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let sessionMap = Map.empty<Text, SessionData>();

  type FileData = {
    filename : Text;
    content : Text;
  };

  type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

  // Internal var-typed persistent session
  type SessionData = {
    id : Text;
    name : Text;
    projectType : Text;
    messages : List.List<Message>;
    files : List.List<FileData>;
    createdAt : Int;
    updatedAt : Int;
    owner : Principal;
  };

  // Immutable view type for public API
  type SessionView = {
    id : Text;
    name : Text;
    projectType : Text;
    messages : [Message];
    files : [FileData];
    createdAt : Int;
    updatedAt : Int;
    owner : Principal;
  };

  func toView(session : SessionData) : SessionView {
    {
      id = session.id;
      name = session.name;
      projectType = session.projectType;
      messages = session.messages.toArray();
      files = session.files.toArray();
      createdAt = session.createdAt;
      updatedAt = session.updatedAt;
      owner = session.owner;
    };
  };

  public shared ({ caller }) func createSession(name : Text, projectType : Text) : async Text {
    let sessionId = name.concat("_").concat(Time.now().toText());
    let newSession : SessionData = {
      id = sessionId;
      name;
      projectType;
      messages = List.empty<Message>();
      files = List.empty<FileData>();
      createdAt = Time.now();
      updatedAt = Time.now();
      owner = caller;
    };

    sessionMap.add(sessionId, newSession);
    sessionId;
  };

  public query ({ caller }) func getSessions() : async [SessionView] {
    let filteredIter = sessionMap.entries().filter(
      func((_, sessionData)) {
        sessionData.owner == caller;
      }
    );
    filteredIter.map(func((_, session)) { toView(session) }).toArray();
  };

  public query ({ caller }) func getSession(sessionId : Text) : async SessionView {
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller) { Runtime.trap("Access denied") };
        toView(session);
      };
    };
  };

  public shared ({ caller }) func addMessage(sessionId : Text, role : Text, content : Text) : async () {
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller) { Runtime.trap("Access denied") };
        let newMessage : Message = {
          role;
          content;
          timestamp = Time.now();
        };
        session.messages.add(newMessage);
        let updatedSession = {
          id = session.id;
          name = session.name;
          projectType = session.projectType;
          messages = session.messages;
          files = session.files;
          createdAt = session.createdAt;
          updatedAt = Time.now();
          owner = session.owner;
        };
        sessionMap.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func updateFiles(sessionId : Text, filename : Text, content : Text) : async () {
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller) { Runtime.trap("Access denied") };
        let newFile : FileData = {
          filename;
          content;
        };
        session.files.add(newFile);
        let updatedSession = {
          id = session.id;
          name = session.name;
          projectType = session.projectType;
          messages = session.messages;
          files = session.files;
          createdAt = session.createdAt;
          updatedAt = Time.now();
          owner = session.owner;
        };
        sessionMap.add(sessionId, updatedSession);
      };
    };
  };

  public shared ({ caller }) func deleteSession(sessionId : Text) : async () {
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?_) {
        sessionMap.remove(sessionId);
      };
    };
  };
};
