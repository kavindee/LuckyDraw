// interface SlotConfigurations {
//   /** User configuration for maximum item inside a reel */
//   maxReelItems?: number;
//   /** User configuration for whether winner should be removed from name list */
//   removeWinner?: boolean;
//   /** User configuration for element selector which reel items should append to */
//   reelContainerSelector: string;
//   /** User configuration for callback function that runs before spinning reel */
//   onSpinStart?: () => void;
//   /** User configuration for callback function that runs after spinning reel */
//   onSpinEnd?: () => void;

//   /** User configuration for callback function that runs after user updates the name list */
//   onNameListChanged?: () => void;
// }

// /** Class for doing random name pick and animation */
// export default class Slot {
//   /** List of names to draw from */
//   private nameList: string[];

//   /** Whether there is a previous winner element displayed in reel */


//   /** Container that hold the reel items */
//   private reelContainer: HTMLElement | null;

//   /** Maximum item inside a reel */
//   private maxReelItems: NonNullable<SlotConfigurations['maxReelItems']>;

//   /** Whether winner should be removed from name list */
//   private shouldRemoveWinner: NonNullable<SlotConfigurations['removeWinner']>;

//   /** Reel animation object instance */
//   private reelAnimation?: Animation;
//   private spinCount: number = 0;

//   /** Callback function that runs before spinning reel */
//   private onSpinStart?: NonNullable<SlotConfigurations['onSpinStart']>;

//   /** Callback function that runs after spinning reel */
//   private onSpinEnd?: NonNullable<SlotConfigurations['onSpinEnd']>;

//   /** Callback function that runs after spinning reel */
//   private onNameListChanged?: NonNullable<SlotConfigurations['onNameListChanged']>;

//   /**
//    * Constructor of Slot
//    * @param maxReelItems  Maximum item inside a reel
//    * @param removeWinner  Whether winner should be removed from name list
//    * @param reelContainerSelector  The element ID of reel items to be appended
//    * @param onSpinStart  Callback function that runs before spinning reel
//    * @param onNameListChanged  Callback function that runs when user updates the name list
//    */
//   constructor(
//     {
//       maxReelItems = 30,
//       removeWinner = true,
//       reelContainerSelector,
//       onSpinStart,
//       onSpinEnd,
//       onNameListChanged
//     }: SlotConfigurations
//   ) {
//     this.nameList = [];
//     this.reelContainer = document.querySelector(reelContainerSelector);
//     this.maxReelItems = maxReelItems;
//     this.shouldRemoveWinner = removeWinner;
//     this.onSpinStart = onSpinStart;
//     this.onSpinEnd = onSpinEnd;
//     this.onNameListChanged = onNameListChanged;

//     // Create reel animation
//     this.reelAnimation = this.reelContainer?.animate(
//       [
//         { transform: 'none', filter: 'blur(0)' },
//         { filter: 'blur(1px)', offset: 0.5 },
//         // Here we transform the reel to move up and stop at the top of last item
//         // "(Number of item - 1) * height of reel item" of wheel is the amount of pixel to move up
//         // 7.5rem * 16 = 120px, which equals to reel item height
//         { transform: `translateY(-${(this.maxReelItems - 1) * (7.5 * 16)}px)`, filter: 'blur(0)' }
//       ],
//       {
//         duration: this.maxReelItems * 100, // 100ms for 1 item
//         easing: 'ease-in-out',
//         iterations: 1
//       }
//     );

//     this.reelAnimation?.cancel();
//   }

//   /**
//    * Setter for name list
//    * @param names  List of names to draw a winner from
//    */
//   set names(names: string[]) {
//     this.nameList = names;

//     const reelItemsToRemove = this.reelContainer?.children
//       ? Array.from(this.reelContainer.children)
//       : [];

//     reelItemsToRemove
//       .forEach((element) => element.remove());



//     if (this.onNameListChanged) {
//       this.onNameListChanged();
//     }
//   }

//   /** Getter for name list */
//   get names(): string[] {
//     return this.nameList;
//   }

//   /**
//    * Setter for shouldRemoveWinner
//    * @param removeWinner  Whether the winner should be removed from name list
//    */
//   set shouldRemoveWinnerFromNameList(removeWinner: boolean) {
//     this.shouldRemoveWinner = removeWinner;
//   }

//   /** Getter for shouldRemoveWinner */
//   get shouldRemoveWinnerFromNameList(): boolean {
//     return this.shouldRemoveWinner;
//   }

//   /**
//    * Returns a new array where the items are shuffled
//    * @template T  Type of items inside the array to be shuffled
//    * @param array  The array to be shuffled
//    * @returns The shuffled array
//    */
//   private static shuffleNames<T = unknown>(array: T[]): T[] {
//     const keys = Object.keys(array) as unknown[] as number[];
//     const result: T[] = [];
//     for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
//       // eslint-disable-next-line no-bitwise
//       const i = Math.random() * n | 0;
//       const key = keys[i];
//       result.push(array[key]);
//       n -= 1;
//       const tmp = keys[n];
//       keys[n] = key;
//       keys[i] = tmp;
//     }
//     return result;
//   }

//   /**
//    * Function for spinning the slot
//    * @returns Whether the spin is completed successfully
//    */
//   public async spin(): Promise<boolean> {
//     if (!this.nameList.length) {
//       console.error('Name List is empty. Cannot start spinning.');
//       return false;
//     }
  
//     if (this.onSpinStart) {
//       this.onSpinStart();
//     }
  
//     const { reelContainer, reelAnimation, shouldRemoveWinner } = this;
//     if (!reelContainer || !reelAnimation) {
//       return false;
//     }
  
//     // Adjust the logic for the first two spins to ensure "hasitha" and "chathurya" win, respectively.
//     let displayNames: string[] = [];
//     if (this.spinCount === 0 && this.nameList.includes("Hasitha Moragalle")) {
//       displayNames = ["Hasitha Moragalle", ...Slot.shuffleNames<string>(this.nameList.filter(name => name !== "Hasitha Moragalle"))];
//       this.spinCount++; // Increment after the first spin
//     } else if (this.spinCount === 1 && this.nameList.includes("Chathurya Nanayakkara")) {
//       displayNames = ["Chathurya Nanayakkara", ...Slot.shuffleNames<string>(this.nameList.filter(name => name !== "Chathurya Nanayakkara"))];
//       this.spinCount++; // Increment after the second spin
//     } else {
//       displayNames = Slot.shuffleNames<string>(this.nameList);
//     }
  
//     // Ensure the list is long enough for the visual spinning effect
//     while (displayNames.length < this.maxReelItems) {
//       displayNames = [...displayNames, ...displayNames];
//     }
//     displayNames = displayNames.slice(0, this.maxReelItems);
  
//     // Create and append new reel items for the visual effect
//     reelContainer.innerHTML = ''; // Clear the existing items
//     displayNames.forEach((name) => {
//       const newReelItem = document.createElement('div');
//       newReelItem.classList.add('reel-item');
//       newReelItem.textContent = name;
//       reelContainer.appendChild(newReelItem);
//     });
  
//     // Play the spin animation
//     reelAnimation.play();
//     await reelAnimation.finished;
  
//     // Determine and display the winner
//     const winnerElement = document.getElementById('winner');
//     let winnerName = displayNames[0]; // The first name in the list is the winner
  
//     if (winnerElement) {
//       winnerElement.textContent = winnerName;
//     }
  
//     // Remove the winner from the list if required
//     if (shouldRemoveWinner) {
//       this.nameList = this.nameList.filter(name => name !== winnerName);
//       if (this.onNameListChanged) {
//         this.onNameListChanged();
//       }
//     }
  

  
//     if (this.onSpinEnd) {
//       this.onSpinEnd();
//     }
  
//     return true; // Indicate the spin was successfully completed
//   }

  

// }
interface SlotConfigurations {
  /** User configuration for maximum item inside a reel */
  maxReelItems?: number;
  /** User configuration for whether winner should be removed from name list */
  removeWinner?: boolean;
  /** User configuration for element selector which reel items should append to */
  reelContainerSelector: string;
  /** User configuration for callback function that runs before spinning reel */
  onSpinStart?: () => void;
  /** User configuration for callback function that runs after spinning reel */
  onSpinEnd?: () => void;

  /** User configuration for callback function that runs after user updates the name list */
  onNameListChanged?: () => void;
}

/** Class for doing random name pick and animation */
export default class Slot {
  /** List of names to draw from */
  private nameList: string[];

  /** Whether there is a previous winner element displayed in reel */
  private havePreviousWinner: boolean;

  /** Container that hold the reel items */
  private reelContainer: HTMLElement | null;

  /** Maximum item inside a reel */
  private maxReelItems: NonNullable<SlotConfigurations['maxReelItems']>;

  /** Whether winner should be removed from name list */
  private shouldRemoveWinner: NonNullable<SlotConfigurations['removeWinner']>;

  /** Reel animation object instance */
  private reelAnimation?: Animation;

  /** Callback function that runs before spinning reel */
  private onSpinStart?: NonNullable<SlotConfigurations['onSpinStart']>;

  /** Callback function that runs after spinning reel */
  private onSpinEnd?: NonNullable<SlotConfigurations['onSpinEnd']>;

  /** Callback function that runs after spinning reel */
  private onNameListChanged?: NonNullable<SlotConfigurations['onNameListChanged']>;

  /**
   * Constructor of Slot
   * @param maxReelItems  Maximum item inside a reel
   * @param removeWinner  Whether winner should be removed from name list
   * @param reelContainerSelector  The element ID of reel items to be appended
   * @param onSpinStart  Callback function that runs before spinning reel
   * @param onNameListChanged  Callback function that runs when user updates the name list
   */
  constructor(
    {
      maxReelItems = 30,
      removeWinner = true,
      reelContainerSelector,
      onSpinStart,
      onSpinEnd,
      onNameListChanged
    }: SlotConfigurations
  ) {
    this.nameList = [];
    this.havePreviousWinner = false;
    this.reelContainer = document.querySelector(reelContainerSelector);
    this.maxReelItems = maxReelItems;
    this.shouldRemoveWinner = removeWinner;
    this.onSpinStart = onSpinStart;
    this.onSpinEnd = onSpinEnd;
    this.onNameListChanged = onNameListChanged;

    // Create reel animation
    this.reelAnimation = this.reelContainer?.animate(
      [
        { transform: 'none', filter: 'blur(0)' },
        { filter: 'blur(1px)', offset: 0.5 },
        // Here we transform the reel to move up and stop at the top of last item
        // "(Number of item - 1) * height of reel item" of wheel is the amount of pixel to move up
        // 7.5rem * 16 = 120px, which equals to reel item height
        { transform: `translateY(-${(this.maxReelItems - 1) * (7.5 * 16)}px)`, filter: 'blur(0)' }
      ],
      {
        duration: this.maxReelItems * 100, // 100ms for 1 item
        easing: 'ease-in-out',
        iterations: 1
      }
    );

    this.reelAnimation?.cancel();
  }

  /**
   * Setter for name list
   * @param names  List of names to draw a winner from
   */
  set names(names: string[]) {
    this.nameList = names;

    const reelItemsToRemove = this.reelContainer?.children
      ? Array.from(this.reelContainer.children)
      : [];

    reelItemsToRemove
      .forEach((element) => element.remove());

    this.havePreviousWinner = false;

    if (this.onNameListChanged) {
      this.onNameListChanged();
    }
  }

  /** Getter for name list */
  get names(): string[] {
    return this.nameList;
  }

  /**
   * Setter for shouldRemoveWinner
   * @param removeWinner  Whether the winner should be removed from name list
   */
  set shouldRemoveWinnerFromNameList(removeWinner: boolean) {
    this.shouldRemoveWinner = removeWinner;
  }

  /** Getter for shouldRemoveWinner */
  get shouldRemoveWinnerFromNameList(): boolean {
    return this.shouldRemoveWinner;
  }

  /**
   * Returns a new array where the items are shuffled
   * @template T  Type of items inside the array to be shuffled
   * @param array  The array to be shuffled
   * @returns The shuffled array
   */
  private static shuffleNames<T = unknown>(array: T[]): T[] {
    const keys = Object.keys(array) as unknown[] as number[];
    const result: T[] = [];
    for (let k = 0, n = keys.length; k < array.length && n > 0; k += 1) {
      // eslint-disable-next-line no-bitwise
      const i = Math.random() * n | 0;
      const key = keys[i];
      result.push(array[key]);
      n -= 1;
      const tmp = keys[n];
      keys[n] = key;
      keys[i] = tmp;
    }
    return result;
  }

  /**
   * Function for spinning the slot
   * @returns Whether the spin is completed successfully
   */
  public async spin(): Promise<boolean> {
    if (!this.nameList.length) {
      console.error('Name List is empty. Cannot start spinning.');
      return false;
    }
  
    if (this.onSpinStart) {
      this.onSpinStart();
    }
  
    const { reelContainer, reelAnimation, shouldRemoveWinner } = this;
    if (!reelContainer || !reelAnimation) {
      return false;
    }
  
    // Ensure "chathurya" is the first name for the first spin, then shuffle the rest
    let displayNames = !this.havePreviousWinner && this.nameList.includes("chathurya") 
                       ? ["chathurya", ...Slot.shuffleNames<string>(this.nameList.filter(name => name !== "chathurya"))] 
                       : Slot.shuffleNames<string>(this.nameList);
  
    // Make the list long enough for the visual spinning effect
    while (displayNames.length < this.maxReelItems) {
      displayNames = [...displayNames, ...displayNames];
    }
    displayNames = displayNames.slice(0, this.maxReelItems);
  
    // Create and append new reel items for visual effect
    reelContainer.innerHTML = ''; // Clear the existing items
    displayNames.forEach((name) => {
      const newReelItem = document.createElement('div');
      newReelItem.classList.add('reel-item'); // Add CSS class for styling
      newReelItem.textContent = name; // Set the name as the content
      reelContainer.appendChild(newReelItem);
    });
  
    // Play the spin animation
    reelAnimation.play();
    await reelAnimation.finished;
  
    // Determine and display the winner
    const winnerElement = document.getElementById('winner');
    let winnerName = displayNames[0]; // The first name in the list is the winner
  
    if (winnerElement) {
      winnerElement.textContent = winnerName;
    }
  
    // Remove the winner from the list immediately after being selected
    if (shouldRemoveWinner) {
      this.nameList = this.nameList.filter(name => name !== winnerName);
      if (this.onNameListChanged) {
        this.onNameListChanged(); // Call the name list changed callback, if set
      }
    }
  
    // Set the flag that a spin has completed
    this.havePreviousWinner = true;
  
    if (this.onSpinEnd) {
      this.onSpinEnd(); // Call the spin end callback, if set
    }
    
    return true; // Indicate the spin was successfully completed
  }
  
  
}
