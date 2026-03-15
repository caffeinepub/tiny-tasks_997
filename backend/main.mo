import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Time "mo:core/Time";

actor {
  type Task = {
    id : Nat;
    title : Text;
    dueDate : ?Time.Time;
    priority : Text;
    notes : ?Text;
    completed : Bool;
  };

  type User = {
    displayName : Text;
  };

  var users : Map.Map<Principal, User> = Map.empty<Principal, User>();
  var tasks : Map.Map<Principal, Map.Map<Nat, Task>> = Map.empty<Principal, Map.Map<Nat, Task>>();
  var nextTaskId : Nat = 0;

  public shared ({ caller }) func setDisplayName(displayName : Text) : async () {
    users.add(caller, { displayName });
  };

  public shared ({ caller }) func createTask(title : Text, dueDate : ?Time.Time, priority : Text, notes : ?Text) : async Nat {
    let task : Task = {
      id = nextTaskId;
      title;
      dueDate;
      priority;
      notes;
      completed = false;
    };

    switch (tasks.get(caller)) {
      case (null) { tasks.add(caller, Map.empty<Nat, Task>()) };
      case (?userTasks) { userTasks.add(nextTaskId, task) };
    };

    nextTaskId += 1;
    nextTaskId - 1;
  };

  public shared ({ caller }) func updateTask(id : Nat, title : Text, dueDate : ?Time.Time, priority : Text, notes : ?Text, completed : Bool) : async Bool {
    switch (tasks.get(caller)) {
      case (null) { false };
      case (?userTasks) {
        if (userTasks.containsKey(id)) {
          let updatedTask : Task = {
            id;
            title;
            dueDate;
            priority;
            notes;
            completed;
          };
          userTasks.add(id, updatedTask);
          true;
        } else {
          false;
        };
      };
    };
  };

  public shared query ({ caller }) func getTasks() : async [Task] {
    switch (tasks.get(caller)) {
      case (null) { [] };
      case (?userTasks) { userTasks.values().toArray() };
    };
  };

  public shared query ({ caller }) func getDisplayName() : async ?Text {
    switch (users.get(caller)) {
      case (null) { null };
      case (?user) { ?user.displayName };
    };
  };
};
