import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  type FileData = {
    filename : Text;
    content : Text;
  };

  type Message = {
    role : Text;
    content : Text;
    timestamp : Int;
  };

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

  let sessionMap = Map.empty<Text, SessionData>();

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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createSession(name : Text, projectType : Text) : async ?SessionView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };

    if (name.isEmpty()) {
      return null;
    };

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
    ?toView(newSession);
  };

  public query ({ caller }) func getSessions() : async [SessionView] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can list sessions");
    };
    let filteredIter = sessionMap.entries().filter(
      func((_, sessionData)) {
        sessionData.owner == caller;
      }
    );
    filteredIter.map(func((_, session)) { toView(session) }).toArray();
  };

  public query ({ caller }) func getSession(sessionId : Text) : async SessionView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get sessions");
    };
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller) { Runtime.trap("Access denied") };
        toView(session);
      };
    };
  };

  public shared ({ caller }) func addMessage(sessionId : Text, role : Text, content : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add messages");
    };
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update files");
    };
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
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete sessions");
    };
    switch (sessionMap.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Access denied: You can only delete your own sessions");
        };
        sessionMap.remove(sessionId);
      };
    };
  };
};
